"use strict";
exports.__esModule = true;
var path = require("path");
var worker_threads_1 = require("worker_threads");
var express = require("express");
var cors = require("cors");
var http = require("http");
//--------------------------------------------------------------------------------
//main 실행 함수
var main = function () {
    //호스팅 서버 슬립 방지
    setInterval(function () {
        http.get("http://korean-webtoon-hub-project.herokuapp.com");
    }, sec(600));
    //호스팅 시작과 동시에 전체 데이터 1회 업데이트
    hosting_start();
    webtoon_update();
    //1분 간격으로 전체 data 업데이트
    setInterval(function () {
        webtoon_update();
    }, sec(60));
};
//--------------------------------------------------------------------------------
//json 형식으로 웹에 배포
var hosting_start = function () {
    var app = express();
    app.use(cors());
    app.get("/webtoon/all", function (request, response) {
        response.json(webtoon_info_json);
    });
    app.listen(process.env.PORT || 8080, function () {
        console.log("webtoon api hosting started on port 8080.");
    });
};
var webtoon_info_json = [];
var webtoon_update = function () {
    var workerPath_webtoon_info = path.join(__dirname, "./worker/webtoon_info.js");
    var webtoon_info = new worker_threads_1.Worker(workerPath_webtoon_info);
    webtoon_info.on("message", function (webtoon_info) {
        webtoon_info_json = webtoon_info;
        webtoon_info_json.sort(function (a, b) {
            return a.title < b.title ? -1 : 1;
        });
    });
};
//초 단위로 변환
function sec(time) {
    return time * 1000;
}
main();
