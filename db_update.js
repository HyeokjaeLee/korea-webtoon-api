const path = require("path");
const { Worker } = require("worker_threads");
const express = require("express");
var cors = require("cors");

//호스팅 서버 슬립 방지
const http = require("http");
setInterval(function () {
  http.get("http://korean-webtoon-hub-project.herokuapp.com");
}, sec(600));

let workerPath_webtoon_info = path.join(__dirname, "./worker/webtoon_info.js");

//호스팅 시작과 동시에 전체 데이터 1회 업데이트
hosting_start();
naver_overall_update();

//1분 간격으로 전체 네이버 data 업데이트
setInterval(function () {
  naver_overall_update();
}, sec(60));

//json 형식으로 웹에 배포
function hosting_start() {
  var app = express();
  app.use(cors());

  app.get("/webtoon/all", function (request, response) {
    response.json(webtoon_info_json);
  });

  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 8080.");
  });
}

//네이버 완결 data 업데이트
var webtoon_info_json = [];
function naver_overall_update() {
  let webtoon_info = new Worker(workerPath_webtoon_info);
  webtoon_info.on("message", (webtoon_info) => {
    webtoon_info_json = webtoon_info;
    webtoon_info_json.sort(function (a, b) {
      return a.title < b.title ? -1 : 1;
    });
  });
}

//초 단위로 변환
function sec(time) {
  return time * 1000;
}
