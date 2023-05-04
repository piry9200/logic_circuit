//circuit内にあるオブジェクトを結線する処理をする

//監視する要素の指定
var element = document.getElementById('circuit');

let chosen_gates = []; //グローバル 選択された論理ゲートをオブジェクトのまま保持

//MutationObserver（インスタンス）の作成
var mo = new MutationObserver(function(record, observer) { //変化した際の処理を記述
    let gates = document.getElementsByClassName("gate");
    
    for(let gate of gates){ //ダブルクリックで背景色をピンクにするイベントを設置
        if (gate.dataset.event) { //addEventListnerの重複を回避
            continue;
        }
        gate.dataset.event = true //イベントが登録されいることを示す
        gate.addEventListener("dblclick", (event) => { //ダブルクリックされたら、そのオブジェクトをピンクにすると同時に、回路内に他にピンクのやつがいないかどうかを判定
            if(event.target.style.backgroundColor != "pink"){
                event.target.style.backgroundColor = "pink";
                chosen_gates.push(event.target);
            }
            if(chosen_gates.length == 2){ //選択されている二つのゲートに対しての処理
                let leftside_Xcoordinate = chosen_gates[0].getBoundingClientRect().left;
                if(leftside_Xcoordinate > chosen_gates[1].getBoundingClientRect().left){ //chosen_gatesの[0]の方が左側にあるようにする
                    let temp = chosen_gates[1];
                    chosen_gates[1] = chosen_gates[0];
                    chosen_gates[0] = temp;
                }
                
                switch(chosen_gates[1].dataset.type){ //右側にある論理ゲートによって処理を変える 左側からは出力のみなのですべてdata-timechartから
                    case "AND":
                        let answer1 = []; //二つのインプットの計算結果を入れる用
                        if(chosen_gates[1].dataset.input1 == undefined || chosen_gates[1].dataset.input1 == "undefined" || chosen_gates[1].dataset.input1 == null){
                            chosen_gates[1].dataset.input1 = chosen_gates[0].dataset.timechart;
                        }else{
                            chosen_gates[1].dataset.input2 = chosen_gates[0].dataset.timechart;
                            for(let i=0; i<chosen_gates[1].dataset.input2.length; i = i+2){
                                answer1.push(chosen_gates[1].dataset.input1[i] * chosen_gates[1].dataset.input2[i]);
                            }
                            chosen_gates[1].dataset.timechart = answer1;
                        }
                            break;
                    case "OR":
                        let answer2 = []; //二つのインプットの計算結果を入れる用
                        if(chosen_gates[1].dataset.input1 == undefined || chosen_gates[1].dataset.input1 == "undefined" || chosen_gates[1].dataset.input1 == null){
                            chosen_gates[1].dataset.input1 = chosen_gates[0].dataset.timechart;
                        }else{
                            chosen_gates[1].dataset.input2 = chosen_gates[0].dataset.timechart;
                            for(let i=0; i<chosen_gates[1].dataset.input2.length; i = i+2){
                                if(chosen_gates[1].dataset.input1[i] + chosen_gates[1].dataset.input2[i] >= 1){
                                    answer2.push(1);
                                }else{
                                    answer2.push(0);
                                }
                            }
                            chosen_gates[1].dataset.timechart = answer2;
                        }
                            break;
                    case "NOT":
                        let answer3 = []; //計算結果を入れる用
                        chosen_gates[1].dataset.input1 = chosen_gates[0].dataset.timechart;
                        for(let i=0; i<chosen_gates[1].dataset.input1.length; i = i+2){
                            answer3.push(chosen_gates[1].dataset.input1[i] == 1 ? 0 : 1);
                        }
                        chosen_gates[1].dataset.timechart = answer3;
                            break;
                    case "output":
                        let flag = 0;
                        for(let i=0; i<chosen_gates[1].dataset.output.length; i = i+2){
                            if(chosen_gates[0].dataset.timechart[i] != chosen_gates[1].dataset.output[i]){
                                flag = 1;
                            }
                        }
                        if(flag == 1){
                            window.alert("うわあああああああああ");
                        }else{
                            window.alert("もう寝ろ");
                        }
                }

                for(let chosen_gate of chosen_gates){
                    chosen_gate.style.backgroundColor = "";
                }
                chosen_gates.splice(0) //すべての要素を削除
            }
        })
    }
});

function setLines(startElement, endElement){ //
    console.log("関数を実行しますの\n");
    new LeaderLine(startElement,
        LeaderLine.pointAnchor(endElement, {x:"8px", y:"8px"})
    );

}

let button_test = document.getElementById("button_test");
button_test.addEventListener("click", (event) => {
    let test_gates = document.getElementsByClassName("gate");
    setLines(test_gates[0],test_gates[4]);
    }
);


//監視する「もの」の指定（必ず1つ以上trueにする）
var config = {
    childList: true,//「子ノード（テキストノードも含む）」の変化
    attributes: true,//「属性」の変化
    characterData: true,//「テキストノード」の変化
};

//監視の開始
mo.observe(element, config);