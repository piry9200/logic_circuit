//追加された論理ゲートをcircuit内で移動できるようにするための処理が書かれている。circuit内に新たな論理ゲートが追加されるたびに実行

//監視する要素の指定
var element = document.getElementById('circuit');

//MutationObserver（インスタンス）の作成
var mo = new MutationObserver(function(record, observer) { //変化した際の処理を記述

    //以下の処理は、追加された論理ゲートをcircuit内で移動できるようにするための処理。追加されるたびに設定し直す。
    let gates = document.getElementsByClassName("gate");
    let draggable = [];
    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(var i = 0; i < gates.length; i++) {
        draggable[i] = new PlainDraggable(gates[i]);
    }

});

//監視する「もの」の指定（必ず1つ以上trueにする）
var config = {
    childList: true,//「子ノード（テキストノードも含む）」の変化
    attributes: false,//「属性」の変化
    characterData: true,//「テキストノード」の変化
};

//監視の開始
mo.observe(element, config);