const path = require("path");
const { Worker } = require("worker_threads");
const express = require("express");
var cors = require("cors");
const http = require("http");

//호스팅서버 슬립 방지
setInterval(function () {
  http.get("https://korean-webtoon-hub-project.herokuapp.com/");
}, 600000);

var naver_info = [];
var daum_info = [];
var weekday_num = {
  category: "weekday",
  월요일: 0,
  화요일: 1,
  수요일: 2,
  목요일: 3,
  금요일: 4,
  토요일: 5,
  일요일: 6,
  완결: 7,
};
var state_num = {
  category: "state",
  완결: -1,
  연재중: 0,
  업로드: 1,
  휴재중: 2,
};
var timestamp = { category: "timestamp" };
var api_info = [timestamp, weekday_num, state_num];
var webtoon_info;
var api_data;
let workerPath_1 = path.join(__dirname, "./worker/naver_finished.js");
let workerPath_2 = path.join(__dirname, "./worker/naver_weekday.js");
let workerPath_3 = path.join(__dirname, "./worker/daum_all.js");

//호스팅 시작과 동시에 전체 데이터 1회 업데이트
hosting_start();
naver_overall_update();
daum_overall_update();

//30분 간격으로 전체 네이버 data 업데이트
setInterval(function () {
  naver_overall_update();
}, min(30));
//3분 간격으로 연재중 네이버 data 업데이트
setInterval(function () {
  naver_partial_update();
}, min(3));
//6분 간격으로 전체 다음 data 업데이트
setInterval(function () {
  daum_overall_update();
}, min(6));
//1분 간격으로 전체 data 통합 & log 출력
setInterval(function () {
  integrate_db();
  console.log(api_data);
}, min(1));

//json 형식으로 웹에 배포
function hosting_start() {
  var app = express();
  app.use(cors());
  app.get("/", function (request, response) {
    response.json(api_data);
  });
  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 8080.");
  });
}

//네이버 완결 포함 전체 data 업데이트
//contains naver_partial_update
function naver_overall_update() {
  let naver_finished = new Worker(workerPath_1);
  naver_finished.on("message", (result_1) => {
    naver_info = result_1;
  });
  api_info[0].naver_overall_update = new Date();
}

//네이버 연재중 data 업데이트
function naver_partial_update() {
  let naver_weekday = new Worker(workerPath_2);
  naver_weekday.on("message", (result_2) => {
    naver_weekday_info = result_2;
    for (n = 0; n < naver_weekday_info.length; n++) {
      var index_num = naver_info.findIndex(
        (i) => i.title == naver_weekday_info[n].title
      );
      naver_info[index_num] = {
        ...naver_info[index_num],
        ...naver_weekday_info[n],
      };
    }
  });
  api_info[0].naver_partial_update = new Date();
}

//다음 완결 포함 전체 data 업데이트
function daum_overall_update() {
  let daum_all = new Worker(workerPath_3);
  daum_all.on("message", (result_3) => {
    daum_info = result_3;
  });
  api_info[0].daum_overall_update = new Date();
}

//data api화
function integrate_db() {
  webtoon_info = naver_info.concat(daum_info);
  webtoon_info.sort(function (a, b) {
    return a.title < b.title ? -1 : 1;
  });
  api_data = [api_info, webtoon_info];
}

function min(sec) {
  return sec * 60000;
}
