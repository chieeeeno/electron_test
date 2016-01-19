'use strict';

// IPC通信を行う
var ipc = require('ipc');
var info;
window.onload = function () {
  info = document.getElementById('info');
  //testAsync();
};


var sendVal = 200;

// 非同期通信の結果を受けたときのコールバック
ipc.on('async-reply', function(arg) {
  sendVal = arg;
  insertMsg("result = " + arg);
});

// 非同期に通信を行う
function testAsync() {
  // メインプロセスに引数を送信
  ipc.send('async', { value:sendVal });
}
function insertMsg(msg) {
  info.innerHTML += msg + "<br>";
}

//gulp実行
function gulpFunc(){
  ipc.send('gulp', { value:sendVal });
}