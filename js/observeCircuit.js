//circuit内にあるオブジェクトを結線する処理をする

//監視する要素の指定
var element = document.getElementById('circuit');

let chosen_buttons = []; //グローバル 選択された論理ゲートをオブジェクトのまま保持
let lines = {}; //グローバル　回路を結ぶ線を保持

//MutationObserver（インスタンス）の作成
var mo = new MutationObserver(function(record, observer) { //変化した際の処理を記述

    //以下の処理は、追加された論理ゲートをcircuit内で移動できるようにするための処理。追加されるたびに設定し直す。
    let gates = document.getElementsByClassName("gate_parent");
    let draggable = [];

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(let gate of gates) {
        draggable = new PlainDraggable(gate,{
            onDragStart: function(){
                console.log("starrrt")
            },
            onMove: function () {
                if(gate.dataset.type == "AND" || gate.dataset.type == "OR"){//接続する線の数が違うから分けて処理する
                    if(gate.dataset.connecting1 != undefined) lines[gate.dataset.connecting1].position();
                    if(gate.dataset.connecting2 != undefined) lines[gate.dataset.connecting2].position();
                    if(gate.dataset.connecting3 != undefined) lines[gate.dataset.connecting3].position();
                }else{
                    if(gate.dataset.connecting1 != undefined) lines[gate.dataset.connecting1].position();
                    if(gate.dataset.connecting2 != undefined)lines[gate.dataset.connecting2].position();
                }
                
            },
            onDragEnd: function () {

            }
        });
    }

    setting();
});

//出力ボタンにイベントを設定
let do_output_button = document.getElementById("do_output");
do_output_button.addEventListener("click", (event) => {
    let time = document.getElementById("time");
    let clear_time = time.textContent;
    if(event.target.parentNode.dataset.input == event.target.parentNode.dataset.output){
        window.alert("正解\nクリアタイムは" + clear_time + "です");
    }else{
        window.alert("死");
    }
})



function setLines(startElement, endElement){ //
    let line_object = new LeaderLine(startElement,
        LeaderLine.pointAnchor(endElement, {x:"8px", y:"8px"})
    );
    return line_object;

}

function setting(){

    let buttons = document.getElementsByClassName("ioButton");
    
    for(let button of buttons){ //クリックで背景色をピンクにするイベントを設置
        if (button.dataset.event) { //addEventListnerの重複を回避
            continue;
        }

        button.dataset.event = true //イベントが登録されいることを示す
        button.addEventListener("click", (event) => { //クリックされたら、そのオブジェクトをピンクにすると同時に、回路内に他にピンクのやつがいないかどうかを判定
            if(event.target.style.backgroundColor != "pink"){ //クリックされたボタンがピンク色じゃない場合ピンクにする
                event.target.style.backgroundColor = "pink";
                chosen_buttons.push(event.target);
            }else{
                event.target.style.backgroundColor = "";
                chosen_buttons.pop();
            }

            if(event.target.dataset.button_type == "output"){ //outputボタンが選択されたときに実行。入力されている信号から出力用の信号を計算する。
                switch(event.target.parentNode.dataset.type){
                    case "AND":
                        let answer1 = [] //計算結果を入れる用
                        if(event.target.parentNode.dataset.input1 != undefined && event.target.parentNode.dataset.input1 != "undefined" &&
                        event.target.parentNode.dataset.input1 != null && event.target.parentNode.dataset.input2 != undefined && event.target.parentNode.dataset.input2 != "undefined" &&
                        event.target.parentNode.dataset.input2 != null)
                        {//input1 input2が定義されていない（undefined,null)ときは実行しない
                            console.log("calc!");
                            for(let i=0; i<event.target.parentNode.dataset.input1.length; i=i+2){ //datasetのデータには「,」もデータの一つとしてあるため、i+2とすることで回避
                                answer1.push(event.target.parentNode.dataset.input1[i] * event.target.parentNode.dataset.input2[i]);
                            }
                            event.target.dataset.timechart = answer1; //outputボタンに計算結果(timechart)を設定
                        }
                        break
                    case "OR":
                        let answer2 = [] //計算結果を入れる用
                        if(event.target.parentNode.dataset.input1 != undefined && event.target.parentNode.dataset.input1 != "undefined" &&
                        event.target.parentNode.dataset.input1 != null && event.target.parentNode.dataset.input2 != undefined && event.target.parentNode.dataset.input2 != "undefined" &&
                        event.target.parentNode.dataset.input2 != null)
                        {//input1 input2が定義されていない（undefined,null)ときは実行しない
                            for(let i=0; i<event.target.parentNode.dataset.input1.length; i=i+2){
                                let num = event.target.parentNode.dataset.input1[i] + event.target.parentNode.dataset.input2[i];
                                answer2.push( num >= 1 ? 1 : 0); //二つのインプットの和が１以上だったら１をプッシュ
                            }
                            event.target.dataset.timechart = answer2; //outputボタンに計算結果(timechart)を設定
                        }
                        break;
                    case "NOT":
                        let answer3 = [] //計算結果を入れる用
                        if(event.target.parentNode.dataset.input1 != undefined && event.target.parentNode.dataset.input1 != "undefined" &&
                        event.target.parentNode.dataset.input1 != null)
                        {//input1 が定義されていない（undefined,null)ときは実行しない
                            for(let i=0; i<event.target.parentNode.dataset.input1.length; i=i+2){
                                let num = event.target.parentNode.dataset.input1[i]
                                answer3.push( num == 1 ? 0 : 1); //インプットが１だったら0,0だったら1をプッシュ
                            }
                            event.target.dataset.timechart = answer3; //outputボタンに計算結果(timechart)を設定
                        }
                        break;
                }
            }

            if(chosen_buttons.length == 2){ //二つ選択されたときに実行。選択されている二つのゲートに対しての処理
                let leftside_Xcoordinate = chosen_buttons[0].getBoundingClientRect().left;
                if(leftside_Xcoordinate > chosen_buttons[1].getBoundingClientRect().left){ //chosen_buttonsの[0]の方が左側にあるようにする
                    let temp = chosen_buttons[1];
                    chosen_buttons[1] = chosen_buttons[0];
                    chosen_buttons[0] = temp;
                }
                if(chosen_buttons[0].dataset.button_type == "input1" || chosen_buttons[0].dataset.button_type == "input2"){ //左側に論理ゲートのinputボタンがあるときは、[0],[1]を入れ替えて,[0][1]の順番を正しくする
                    let temp = chosen_buttons[1];
                    chosen_buttons[1] = chosen_buttons[0];
                    chosen_buttons[0] = temp;
                }
                //以下、削除機能
                if( chosen_buttons[0].dataset.line_start != undefined && chosen_buttons[1].dataset.line_end != undefined ){ //選ばれた二つのボタンにline_start line_endが定義されているかどうか
                    let temp_start_lines_id = chosen_buttons[0].dataset.line_start //現在のdatasetのlineidたちを取得。使用上配列に「'」が含まれている
                    let temp_end_lines_id = chosen_buttons[1].dataset.line_end //現在のdatasetのlineidたちを取得。使用上配列に「'」が含まれている

                    let start_lines_id = [];
                    let end_lines_id = [];
                    if(temp_start_lines_id == undefined && temp_end_lines_id != undefined){ //end側に線がつながっていないとき、まだ取得できる配列がないので新たに作成する
                        end_lines_id = get_lineIds(temp_end_lines_id);
                    }else if(temp_start_lines_id != undefined && temp_end_lines_id == undefined){ //end側に線がつながっていないとき、まだ取得できる配列がないので新たに作成する
                        start_lines_id = get_lineIds(temp_start_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                    }else if(temp_start_lines_id != undefined && temp_end_lines_id != undefined){
                        start_lines_id = get_lineIds(temp_start_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                        end_lines_id = get_lineIds(temp_end_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                    }
                    console.log("wei")
                    let flag = 0;
                    for(let i = 0; i < start_lines_id.length; i++){ //選択されたボタンに接続されている線idを走査して、一致するものがあったら記憶する
                        for(let j = 0; j < end_lines_id.length; j++){
                            if(start_lines_id[i] == end_lines_id[j]){ //一致するものがあったとき iとjが一致するlineidが入っているインデックスを表す
                                console.log(start_lines_id[i]);
                                console.log(end_lines_id[j]);
                                console.log("削除");
                                lines[start_lines_id[i]].remove();
                             //線を消すとき、一本しかないなら、datasetごと削除する   
                                if(start_lines_id.length == 1 && end_lines_id.length == 1){
                                    start_lines_id.splice(i, 1); //削除した線のidを配列からも削除する
                                    delete chosen_buttons[0].dataset.line_start;
                                    end_lines_id.splice(j, 1); //削除した線のidを配列からも削除する
                                    delete chosen_buttons[1].dataset.line_end;

                                }else if(start_lines_id.length != 1 && end_lines_id.length == 1){

                                    start_lines_id.splice(i, 1); //削除した線のidを配列からも削除する
                                    chosen_buttons[0].dataset.line_start = start_lines_id;
                                    end_lines_id.splice(j, 1); //削除した線のidを配列からも削除する
                                    delete chosen_buttons[1].dataset.line_end;

                                }else if(start_lines_id.length == 1 && end_lines_id.length != 1){

                                    start_lines_id.splice(i, 1); //削除した線のidを配列からも削除する
                                    delete chosen_buttons[0].dataset.line_start;
                                    end_lines_id.splice(j, 1); //削除した線のidを配列からも削除する
                                    chosen_buttons[1].dataset.line_end = end_lines_id;

                                }else{

                                    start_lines_id.splice(i, 1); //削除した線のidを配列からも削除する
                                    end_lines_id.splice(j, 1); //削除した線のidを配列からも削除する
                                    chosen_buttons[0].dataset.line_start = start_lines_id;
                                    chosen_buttons[1].dataset.line_end = end_lines_id;

                                }
                                

                                chosen_buttons[0].style.backgroundColor = "";//色を元に戻す
                                chosen_buttons[1].style.backgroundColor = "";

                                if(chosen_buttons[0].dataset.button_type == "input1"){
                                    delete chosen_buttons[0].parentNode.dataset.connecting1;
                                }else if(chosen_buttons[0].dataset.button_type == "input2"){
                                    delete chosen_buttons[0].parentNode.dataset.connecting2;
                                }else{
                                    if(chosen_buttons[0].parentNode.dataset.connecting3 != undefined){
                                        delete chosen_buttons[0].parentNode.dataset.connecting3;
                                    }
                                }
                                if(chosen_buttons[1].dataset.button_type == "input1"){
                                    delete chosen_buttons[1].parentNode.dataset.connecting1;
                                }else if(chosen_buttons[1].dataset.button_type == "input2"){
                                    delete chosen_buttons[1].parentNode.dataset.connecting2;
                                }else{
                                    if(chosen_buttons[1].parentNode.dataset.connecting3 != undefined){
                                        delete chosen_buttons[1].parentNode.dataset.connecting3;
                                    }
                                }

                                flag = 1;//見つかったらfor脱出
                                break;
                            }
                        }
                        if(flag == 1){
                            break; //見つかったらfor脱出
                        }
                    }

                        
                        chosen_buttons.pop();//選択したボタンリストから削除する
                        chosen_buttons.pop();
                //以下、接続機能
                }else{ //選ばれた二つのボタンがまだ結線されていない場合に実行
                    //右側のボタンがinputで、すでに他のボタンと接続されている場合,接続しない
                    if((chosen_buttons[1].dataset.button_type == "input1" || chosen_buttons[1].dataset.button_type == "input2") &&
                    chosen_buttons[1].dataset.line_end != undefined    ){
                            for(let chosen_button of chosen_buttons){ //色を透明に戻す
                                chosen_button.style.backgroundColor = "";
                            }
                            chosen_buttons.splice(0) //すべての要素を削除
                    }
                    else{
                        let temp_start_lines_id = chosen_buttons[0].dataset.line_start //現在のdatasetのlineidたちを取得。使用上配列に「'」が含まれている
                        let temp_end_lines_id = chosen_buttons[1].dataset.line_end //現在のdatasetのlineidたちを取得。使用上配列に「'」が含まれている
                        
                        let start_lines_id = [];
                        let end_lines_id = [];
                        if(temp_start_lines_id == undefined && temp_end_lines_id != undefined){ //end側に線がつながっていないとき、まだ取得できる配列がないので新たに作成する
                            end_lines_id = get_lineIds(temp_end_lines_id);
                        }else if(temp_start_lines_id != undefined && temp_end_lines_id == undefined){ //end側に線がつながっていないとき、まだ取得できる配列がないので新たに作成する
                            start_lines_id = get_lineIds(temp_start_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                        }else if(temp_start_lines_id != undefined && temp_end_lines_id != undefined){
                            start_lines_id = get_lineIds(temp_start_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                            end_lines_id = get_lineIds(temp_end_lines_id); //選択されたボタンの始点側に接続されているボタンのリスト
                        }
                        
                        
                        //左(timechart)から右( input(1 or 2) )に代入
                        chosen_buttons[1].dataset.input = chosen_buttons[0].dataset.timechart; //inputボタンに信号を代入
                        //---------------↓gate_parentのdatasetにinput1,input2として保持させる-------------
                        if(chosen_buttons[1].dataset.button_type == "input1"){ //input1ボタンからgate_parentのdataset.input1に代入
                            chosen_buttons[1].parentNode.dataset.input1 = chosen_buttons[1].dataset.input;
                        }else if(chosen_buttons[1].dataset.button_type == "input2"){ //input2ボタンからgate_parentのdataset.input2に代入
                            chosen_buttons[1].parentNode.dataset.input2 = chosen_buttons[1].dataset.input;
                        }else if(chosen_buttons[1].parentNode.id == "output"){
                            chosen_buttons[1].parentNode.dataset.input = chosen_buttons[1].dataset.input;
                        }
                        //------------------------------------------------------------------------------
                        for(let chosen_button of chosen_buttons){ //色を透明に戻す
                            chosen_button.style.backgroundColor = "";
                        }
                        //線を引いて、引いた線に関わるオブジェクトたちに線の情報をセット
                        let line = setLines(chosen_buttons[0], chosen_buttons[1]);
                        start_lines_id.push(line._id);
                        end_lines_id.push(line._id);
                        console.log(typeof(end_lines_id));
                        console.log("test2");
                        lines[start_lines_id[ start_lines_id.length - 1]] = line; //現在回路上にある線をインデックスを線のidと一致させて管理
                        chosen_buttons[0].dataset.line_start = start_lines_id;
                        chosen_buttons[1].dataset.line_end = end_lines_id;
                        //-----------------gate_parentに接続中の線の情報を送る-----------------------
                        switch(chosen_buttons[0].parentNode.dataset.type){
                            case "AND":
                            case "OR":
                                if(chosen_buttons[0].dataset.button_type == "input1"){ //input1に入る線のidはconnecting1へ 2は2へ
                                    chosen_buttons[0].parentNode.dataset.connecting1 = chosen_buttons[0].dataset.line_start
                                }else if(chosen_buttons[0].dataset.button_type == "input2"){ //parentNode.dataset.connecting2が定義されいないときに実行
                                    chosen_buttons[0].parentNode.dataset.connecting2 = chosen_buttons[0].dataset.line_start
                                }else{
                                    chosen_buttons[0].parentNode.dataset.connecting3 = chosen_buttons[0].dataset.line_start
                                }
                                break;
                            case "NOT":
                                if(chosen_buttons[0].dataset.button_type == "input1"){ //input1に入る線のidはconnecting1へ 2は2へ
                                    chosen_buttons[0].parentNode.dataset.connecting1 = chosen_buttons[0].dataset.line_start
                                }else{
                                    chosen_buttons[0].parentNode.dataset.connecting2 = chosen_buttons[0].dataset.line_start
                                }
                                break;
                            default: break;
                        }
                        // ↑↑↑↑↑結線の左側に対して処理　        結線の右側に対して処理↓↓↓↓↓↓↓↓
                        switch(chosen_buttons[1].parentNode.dataset.type){
                            case "AND":
                            case "OR":
                                if(chosen_buttons[1].dataset.button_type == "input1"){ //input1に入る線のidはconnecting1へ 2は2へ
                                    chosen_buttons[1].parentNode.dataset.connecting1 = chosen_buttons[1].dataset.line_end;
                                }else if(chosen_buttons[1].dataset.button_type == "input2"){ //parentNode.dataset.connecting2が定義されいないときに実行
                                    chosen_buttons[1].parentNode.dataset.connecting2 = chosen_buttons[1].dataset.line_end;
                                }else{
                                    chosen_buttons[1].parentNode.dataset.connecting3 = chosen_buttons[1].dataset.line_end;
                                }
                                break;
                            case "NOT":
                                if(chosen_buttons[1].dataset.button_type == "input1"){ //input1に入る線のidはconnecting1へ 2は2へ
                                    chosen_buttons[1].parentNode.dataset.connecting1 = chosen_buttons[1].dataset.line_end;
                                }else{
                                    chosen_buttons[1].parentNode.dataset.connecting2 = chosen_buttons[1].dataset.line_end;
                                }
                            default: break;
                        //------------↑↑↑↑↑↑gate_parentに接続中の線の情報を送る↑↑↑↑↑↑----------------------------------------

                        }
                        chosen_buttons.splice(0) //すべての要素を削除
                    }
                }
                
            }
        })

    }

}

function get_lineIds(temp_lines_id){ //「'」入りの配列を「'」無し配列に変更
    let lines_id = [];//選択されたボタンの始点側に接続されているボタンのリスト
    console.log()
    for(let i = 0; i < temp_lines_id.length; i = i + 2){
        lines_id[i/2] = temp_lines_id[i];
    }

    return lines_id;
}

/*
let button_test = document.getElementById("button_test");
button_test.addEventListener("click", (event) => {
    let test_gates = document.getElementsByClassName("ioButton");
    let line = setLines(test_gates[0], test_gates[4]);
    let line_id = line.position()._id;
    lines[line_id] = line;
    console.log(lines);
    }
);
*/


//監視する「もの」の指定（必ず1つ以上trueにする）
var config = {
    childList: true,//「子ノード（テキストノードも含む）」の変化
    attributes: true,//「属性」の変化
    characterData: true,//「テキストノード」の変化
};

setting(); //初期設定
//監視の開始
mo.observe(element, config);