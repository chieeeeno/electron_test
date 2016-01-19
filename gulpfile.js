'use strict';

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


// タスク定義
//gulp.task('watch', function (callback) {
//  // index.ejsとindex.jsonの両方を監視
//  gulp.watch(['./src/index.ejs', './src/data/data.json'], function (e) {
//    // 削除以外 == 追加 or 変更
//    if (e.type != "deleted") {
//      // 最新のJSONファイルを同期読み込みしてオブジェクトを生成
//      var json = JSON.parse(fs.readFileSync("./src/data/data.json"));
//
//      gulp.src("./src/index.ejs")
//        .pipe(plumber())
//      // オブジェクトを渡してデータの当て込み
//        .pipe(ejs({jsonData:json}))
//        .pipe(prettify({indent_size: 2}))
//      // index.htmlに名前を変更
//        .pipe(rename("index.html"))
//        .pipe(gulp.dest("./dest/"))
//    }
//  });
//});


// ページ振り分け用のID
var taskNumber = 0;
var jsonData = require('./src/data/data.json'); 

gulp.task('build', function (callback) {
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


//gulp.task('build', function (callback) {
//  for(var i = 0; i < jsonData.length; i++){
//    gulp.src("./src/index.ejs")
//      .pipe(plumber())
//    // オブジェクトを渡してデータの当て込み
//      .pipe(ejs({
//      jsonData: jsonData[i],//JSONデータをテンプレートファイルに渡す
//      flag: taskNumber
//    }))
//      .pipe(prettify({indent_size: 2}))
//    // index.htmlに名前を変更
//      .pipe(rename(jsonData[i].fileName))
//      .pipe(gulp.dest("./dest"+jsonData[i].filePath))
//  }
//
//});