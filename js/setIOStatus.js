//入力と出力の設定をするための初期設定を実行する

let inputs = [[0,0,0,0,1,1,1,1],[0,0,1,1,0,0,1,1],[0,1,0,1,0,1,0,1]]; //ここの値によって、inputの真理値表の値を決める [[A],[B],[C]]
let output = [0,0,0,0,1,1,1,1];

function setInputs(){ //真理値表の作成と各インプットオブジェクト（A,B,C)に値をセットする
    console.log("関数を実行します\n");
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
    console.log("関数を実行しますわ\n");
    const outputs_table = document.getElementsByClassName("outputs");
    for(let i=0; i<8; i++){
            let td = document.createElement("td");
            td.textContent = output[i]; //<td> 0 or 1</td>を作る
            outputs_table[i].appendChild(td);
    }

    const output_object = document.getElementById("output"); //circuit内のアウトプットオブジェクトに値をdatasetで与える
        output_object.dataset.output = output;
}

const button = document.getElementById("button");
console.log(button);
button.addEventListener("click", setInputs);
button.addEventListener("click", setOutputs);