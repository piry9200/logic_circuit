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
        let gate = document.createElement("img"); //このノードにドラッグされている元のオブジェクトのデータを参照してコピーを作る
        //------circuit内に配置するgateのプロパティを設定--------------
        gate.src = original_gate.src;
        gate.dataset.type = original_gate.dataset.type;
        gate.width = 100;
        gate.height = 100;
        gate.style.position = "absolute";
        gate.style.left = (event.pageX - 50).toString() + "px"; //配置する位置はドロップしたときのマウスカーソルがある位置
        gate.style.top = (event.pageY - 50).toString() + "px"; //-50するのは画像サイズが100*100で、マウスカーソルの先に画像の中心が来るように調整するため
        gate.className = "gate";
        //--------------------------------------------------------
        event.target.appendChild(gate);
    }
    
})