//回路をオリジナルからコピーするための処理を行う

let Gates = document.getElementsByClassName("original_gate");
let Circuit = document.getElementById("circuit");

for(let i=0; i<3; i++){
    Gates[i].draggable = true;

    Gates[i].addEventListener('dragstart', (event) => { // ドラッグが開始された時
        event.dataTransfer.setData("text/plain", event.target.id); //ドラッグされたオブジェジェクトのidを保存
        event.dataTransfer.setDragImage(event.target, 100, 100); //ドラッグ中の画像を設定する
    });    
}

Circuit.addEventListener('dragover', (event) => {
    event.preventDefault() //フィアルを開く動作を抑止する
    event.dataTransfer.dropEffect = 'copy' //ドラッグオーバーしたときのアイコンを「＋」にする
})

Circuit.addEventListener('drop', (event) => {
    event.preventDefault() //フィアルを開く動作を抑止する
    let dragged_id = event.dataTransfer.getData("text/plain"); //ドラッグされているオブジェクトのidを取得
    if(dragged_id){ //オリジナルの論理ゲート以外からのドロップ（circuit内の移動のために行うドラッグ&ドロップなど)では実行しない
        let original_gate = document.getElementById(dragged_id); //ドラッグされている元のゲートのHTMLオブジェクト
        let gate_parent = document.createElement("div"); //このノードにドラッグされている元のオブジェクトのデータを参照してコピーを作る
        gate_parent.style.position = "absolute";
        gate_parent.style.left = (event.pageX - 50).toString() + "px"; //配置する位置はドロップしたときのマウスカーソルがある位置
        gate_parent.style.top = (event.pageY - 50).toString() + "px"; //-50するのは画像サイズが100*100で、マウスカーソルの先に画像の中心が来るように調整するため
        gate_parent.className = "gate_parent"; //論理ゲートの画像とIOボタンをまとめて扱いたいので、親となるタグを作る
        gate_parent.dataset.type = original_gate.dataset.type;
        //------circuit内に配置するgateのプロパティを設定--------------
        let gate = document.createElement("img"); //このノードにドラッグされている元のオブジェクトのデータを参照してコピーを作る
        gate.src = original_gate.src;

        gate.width = 100;
        gate.height = 100;
            //===========回路にインプットとアウトプットのボタンを配置＝＝＝＝＝＝＝＝＝＝
            let type = original_gate.dataset.type;
            switch(type){
                case "AND":
                case "OR":
                    let buttons = [];
                    buttons[0] = document.createElement("button");
                    buttons[1] = document.createElement("button");
                    buttons[2] = document.createElement("button");
                    for(let i=0; i<3; i++){
                        buttons[i].style.position = "fixed"
                        buttons[i].className = "ioButton";
                        if(i == 0){
                            buttons[i].innerText = "input1";
                            buttons[i].style.top = "30px";
                            buttons[i].style.left = "-40px";
                            buttons[i].dataset.button_type = "input1"
                        }else if(i == 1){
                            buttons[i].innerText = "input2";
                            buttons[i].style.top = "60px";
                            buttons[i].style.left = "-40px";
                            buttons[i].dataset.button_type = "input2"
                        }else{
                            buttons[i].innerText = "output";
                            buttons[i].style.left = "100px";
                            buttons[i].style.top = "40px";
                            buttons[i].dataset.button_type = "output"
                        }
                        gate_parent.appendChild(buttons[i]);
                    }
                    break;
                case "NOT":
                    let buttons2 = [];
                    buttons2[0] = document.createElement("button");
                    buttons2[1] = document.createElement("button");
                    for(let i=0; i<2; i++){
                        buttons2[i].style.position = "fixed"
                        buttons2[i].className = "ioButton";
                        if(i == 0){
                            buttons2[i].innerText = "input1";
                            buttons2[i].style.top = "40px";
                            buttons2[i].style.left = "-40px";
                            buttons2[i].dataset.button_type = "input1"
                        }else{
                            buttons2[i].innerText = "output";
                            buttons2[i].style.top = "40px";
                            buttons2[i].style.left = "90px";
                            buttons2[i].dataset.button_type = "output"
                        }
                        gate_parent.appendChild(buttons2[i]);
                    }
                    break;

            }
            //================================================================
            gate_parent.appendChild(gate)
        //--------------------------------------------------------
        event.target.appendChild(gate_parent);
    }
    
})