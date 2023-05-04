//circuit内にあるオブジェクトを結線する処理をする

//監視する要素の指定
var element = document.getElementById('circuit');

let chosen_buttons = []; //グローバル 選択された論理ゲートをオブジェクトのまま保持

//MutationObserver（インスタンス）の作成
var mo = new MutationObserver(function(record, observer) { //変化した際の処理を記述
    let buttons = document.getElementsByClassName("ioButton");
    
    for(let button of buttons){ //ダブルクリックで背景色をピンクにするイベントを設置
        if (button.dataset.event) { //addEventListnerの重複を回避
            continue;
        }
        button.dataset.event = true //イベントが登録されいることを示す
        button.addEventListener("click", (event) => { //クリックされたら、そのオブジェクトをピンクにすると同時に、回路内に他にピンクのやつがいないかどうかを判定
            if(event.target.style.backgroundColor != "pink"){ //クリックされたボタンがピンク色じゃない場合ピンクにする
                event.target.style.backgroundColor = "pink";
                chosen_buttons.push(event.target);
            }

            if(event.target.dataset.button_type == "output"){ //outputボタンが選択されたときに実行。入力されている信号から出力用の信号を計算する。
                switch(event.target.parentNode.dataset.type){
                    case "AND":
                        let answer1 = [] //計算結果を入れる用
                        if(event.target.parentNode.dataset.input1 != undefined && event.target.parentNode.dataset.input1 != "undefined" &&
                        event.target.parentNode.dataset.input1 != null && event.target.parentNode.dataset.input2 != undefined && event.target.parentNode.dataset.input2 != "undefined" &&
                        event.target.parentNode.dataset.input2 != null)
                        {//input1 input2が定義されていない（undefined,null)のときは実行しない
                            for(let i=0; i<event.target.parentNode.dataset.input1.length; i=i+2){
                                console.log("セット！")
                                answer1.push(event.target.parentNode.dataset.input1[i] * event.target.parentNode.dataset.input2[i]);
                            }
                            event.target.dataset.timechart = answer1; //outputボタンに計算結果(timechart)を設定
                        }
                        break
                    case "OR":
                        break;
                    case "NOT":
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
                //左(timechart)から右( input(1 or 2) )に代入
                chosen_buttons[1].dataset.input = chosen_buttons[0].dataset.timechart; //inputボタンに信号を代入
                //↓gate_parentのdatasetにinput1,input2として保持させる
                if(chosen_buttons[1].dataset.button_type == "input1"){ //input1からgate_parentのdataset.input1に代入
                    console.log("hiiiii");
                    chosen_buttons[1].parentNode.dataset.input1 = chosen_buttons[1].dataset.input;
                }else if(chosen_buttons[1].dataset.button_type == "input2"){ //input2からgate_parentのdataset.input1に代入
                    console.log("uiiiii");
                    chosen_buttons[1].parentNode.dataset.input2 = chosen_buttons[1].dataset.input;
                }

                for(let chosen_button of chosen_buttons){
                    chosen_button.style.backgroundColor = "";
                }
                chosen_buttons.splice(0) //すべての要素を削除
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