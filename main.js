'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

var gulpFile = require('gulpfile');

require('crash-reporter').start();



var mainWindow = null;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/front/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});



// 非同期プロセス通信
ipc.on('async', function( event, args ){
  console.log( args );
  var result = args.value * 2;
  // レンダラプロセスへsend
  event.sender.send('async-reply', result);
});



// JSONファイルの読み込みに使用
var fs = require('fs');
// gulp本体
var gulp = require('gulp');
// エラーハンドリング
var plumber = require('gulp-plumber');
// ファイル名変更
var rename = require('gulp-rename');
// EJS本体
var ejs = require("gulp-ejs");
//インデント調整
var prettify = require('gulp-prettify');

// ページ振り分け用のID
var taskNumber = 0;
var jsonData = require('./src/data/data.json'); 

ipc.on('guip', function(event, args){
  for (var key in jsonData){
    (function(key) {
      gulp.src("./src/index.ejs")
        .pipe(plumber())
      // オブジェクトを渡してデータの当て込み
        .pipe(ejs({
        jsonData: jsonData[taskNumber],//JSONデータをテンプレートファイルに渡す
        flag: taskNumber
      }))
        .pipe(prettify({indent_size: 2}))
      // index.htmlに名前を変更
        .pipe(rename(jsonData[taskNumber].fileName))
        .pipe(gulp.dest("./dest"+jsonData[taskNumber].filePath));
      taskNumber++;
    })(key);
  }
});