//入力と出力の設定をするための初期設定を実行する

let inputs = [[0,0,0,0,1,1,1,1],[0,0,1,1,0,0,1,1],[0,1,0,1,0,1,0,1]]; //ここの値によって、inputの真理値表の値を決める [[A],[B],[C]]
let outputs = [[0,0,0,1,0,1,1,1], [1,0,1,0,1,0,1,1], [1,0,0,1,0,1,1,0], [0,1,1,0,1,0,0,1], [0,0,0,1,0,1,1,0]];

function setInputs(){ //真理値表の作成と各インプットオブジェクト（A,B,C)に値をセットする
    const inputs_table = document.getElementsByClassName("inputs");
    for(let i=0; i<8; i++){
        for(let j=0; j<3; j++){ //真理値表の一行分を作る
            let td = document.createElement("td");
            td.textContent = inputs[j][i]; //<td> 0 or 1</td>を作る
            inputs_table[i].appendChild(td);
        }
    }
    
    const input_objects = document.getElementsByClassName("ioButton"); //circuit内のインプラントオブジェクトに値をdatasetで与える
    for(let i=0; i<3; i++){
        input_objects[i].dataset.timechart = inputs[i];
    }
}

function setOutputs(){ //真理値表の作成と各アウトプットオブジェクト（X)に値をセットする
    let random_num = getRandom(0, 5); //0-4の五つの値をランダムに取得
    const outputs_table = document.getElementsByClassName("outputs");
    console.log("実行");
    for(let i=0; i<8; i++){
            outputs_table[i].innerHTML = "" //outputtableの子要素を全て削除する　<- 値を更新する処理をするためにすでにあるものを削除する
            let td = document.createElement("td");
            td.textContent = outputs[random_num][i]; //<td> 0 or 1</td>を作る
            outputs_table[i].appendChild(td);
    }

    const output_object = document.getElementById("output"); //circuit内のアウトプットオブジェクトに値をdatasetで与える
        output_object.dataset.output = outputs[random_num];
}

function getRandom(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

const button = document.getElementById("button");//「IOset」ボタンで出力値を更新
button.addEventListener("click", setOutputs);

setInputs();
setOutputs();