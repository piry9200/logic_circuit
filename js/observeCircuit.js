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
                    lines[gate.dataset.connecting1].position();
                    lines[gate.dataset.connecting2].position();
                    lines[gate.dataset.connecting3].position();
                }else{
                    lines[gate.dataset.connecting1].position();
                    lines[gate.dataset.connecting2].position();
                }
                
                console.log("mooooove");
            },
            onDragEnd: function () {
                console.log("end");
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
                            for(let i=0; i<event.target.parentNode.dataset.input1.length; i=i+2){
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
                if( (chosen_buttons[0].dataset.line_start != undefined && chosen_buttons[1].dataset.line_end != undefined) &&
                    (chosen_buttons[0].dataset.line_start == chosen_buttons[1].dataset.line_end)){ //選ばれた二つのボタンがすでに線で結ばれているとき
                        console.log("削除");
                        lines[chosen_buttons[1].dataset.line_end].remove();
                        delete chosen_buttons[1].dataset.line_end; //プロパティを初期化
                        delete chosen_buttons[0].dataset.line_start;
                        chosen_buttons[0].style.backgroundColor = "";//色を元に戻す
                        chosen_buttons[1].style.backgroundColor = "";
                        chosen_buttons.pop();//選択したボタンリストから削除する
                        chosen_buttons.pop();
                }else{ //選ばれた二つのボタンがまだ結線されていない場合に実行
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
                    let line_id = line._id;
                    lines[line_id] = line;
                    chosen_buttons[0].dataset.line_start = line_id;
                    chosen_buttons[1].dataset.line_end = line_id;
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
        })

    }

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