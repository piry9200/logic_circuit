//追加された論理ゲートをcircuit内で移動できるようにするための処理が書かれている。circuit内に新たな論理ゲートが追加されるたびに実行

//監視する要素の指定
var element = document.getElementById('circuit');

//MutationObserver（インスタンス）の作成
var mo = new MutationObserver(function(record, observer) { //変化した際の処理を記述

    //以下の処理は、追加された論理ゲートをcircuit内で移動できるようにするための処理。追加されるたびに設定し直す。
    let gates = document.getElementsByClassName("gate");

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(var i = 0; i < gates.length; i++) {
        gates[i].addEventListener("mousedown", mdown);
    }

    //マウスが押された際の関数
    function mdown(e) {
        e.target.addEventListener("mousemove", mmove);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {
        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();
        //マウスが動いた場所に要素を動かす
        let x = e.pageX;
        let y = e.pageY;
        let width = e.target.offsetWidth;
        let height = e.target.offsetHeight;
        e.target.style.top = (y-height/2) + "px";
        e.target.style.left = (x-width/2) + "px";
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        e.target.addEventListener("mouseup", mup);
        

    }

    //マウスボタンが上がったら発火
    function mup(e) {
        e.target.removeEventListener("mousemove", mmove);
        e.target.removeEventListener("onmousedown", mdown);
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