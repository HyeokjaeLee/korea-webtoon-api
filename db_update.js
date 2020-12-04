const path = require("path");
const { Worker } = require("worker_threads");
const express = require("express");
var cors = require("cors");

//호스팅 서버 슬립 방지
const http = require("http");
setInterval(function () {
  http.get("http://korean-webtoon-hub-project.herokuapp.com");
}, min(15));

var naver_info = [];
var naver_weekday_info = [];
var daum_info = [];
var weekday_num = {
  0: "mon",
  1: "tue",
  2: "wed",
  3: "thu",
  4: "fri",
  5: "sat",
  6: "sun",
  7: "finished",
};
var state_num = {
  0: "연재중",
  1: "업로드",
  2: "휴재중",
  3: "완결",
};
var api_category = {
  "/": "API INFO",
  "/mon": "월요일 웹툰",
  "/tue": "화요일 웹툰",
  "/wed": "수요일 웹툰",
  "/thu": "목요일 웹툰",
  "/fri": "금요일 웹툰",
  "/sat": "토요일 웹툰",
  "/sun": "일요일 웹툰",
  "/finished": "완결 웹툰",
  "/all": "전체 웹툰",
};
var webtoon_info_weekday = [];
var webtoon_info_all;

var timestamp = {};
var api_info = {
  "Update time": timestamp,
  "Weekday num": weekday_num,
  "State num": state_num,
  "API Category": api_category,
  "Data count": webtoon_info_all.length,
};
let workerPath_1 = path.join(__dirname, "./worker/naver_finished.js");
let workerPath_2 = path.join(__dirname, "./worker/naver_weekday.js");
let workerPath_3 = path.join(__dirname, "./worker/daum_all.js");

//호스팅 시작과 동시에 전체 데이터 1회 업데이트
hosting_start();
naver_overall_update();
naver_partial_update();
daum_overall_update();

//2시간 간격으로 전체 네이버 data 업데이트
setInterval(function () {
  naver_overall_update();
}, min(120));
//4분 간격으로 연재중 네이버 data 업데이트
setInterval(function () {
  naver_partial_update();
}, min(4));
//4분 간격으로 전체 다음 data 업데이트
setInterval(function () {
  daum_overall_update();
}, min(4));
//2분 간격으로 전체 data 통합 & log 출력
setInterval(function () {
  integrate_db();
  console.log(timestamp);
}, min(2));

//json 형식으로 웹에 배포
function hosting_start() {
  var app = express();
  app.use(cors());
  app.get("/", function (request, response) {
    response.json(api_info);
  });
  app.get("/all", function (request, response) {
    response.json(webtoon_info_all);
  });

  for (var k in weekday_num) {
    app.get("/" + weekday_num[k], function (request, response) {
      response.json(webtoon_info_weekday[k]);
    });
  }

  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 8080.");
  });
}

//네이버 완결 포함 전체 data 업데이트
function naver_overall_update() {
  let naver_finished = new Worker(workerPath_1);
  naver_finished.on("message", (result_1) => {
    naver_info = result_1;
  });
  timestamp.naver_overall_update = new Date();
}

//네이버 연재중 data 업데이트
function naver_partial_update() {
  let naver_weekday = new Worker(workerPath_2);
  naver_weekday.on("message", (result_2) => {
    naver_weekday_info = result_2;
  });
  timestamp.naver_partial_update = new Date();
}

//네이버 웹툰 정보 통합
function intergrate_naver_info() {
  for (n = 0; n < naver_weekday_info.length; n++) {
    var index_num = naver_info.findIndex(
      (i) => i.title == naver_weekday_info[n].title
    );
    naver_info[index_num] = {
      ...naver_info[index_num],
      ...naver_weekday_info[n],
    };
  }
}

//다음 완결 포함 전체 data 업데이트
function daum_overall_update() {
  let daum_all = new Worker(workerPath_3);
  daum_all.on("message", (result_3) => {
    daum_info = result_3;
  });
  timestamp.daum_overall_update = new Date();
}

//data 분류
function integrate_db() {
  intergrate_naver_info();
  webtoon_info_all = naver_info.concat(daum_info);
  webtoon_info_all.sort(function (a, b) {
    return a.title < b.title ? -1 : 1;
  });
  for (var k in weekday_num) {
    webtoon_info_weekday[k] = webtoon_info_all.filter(function (element) {
      return element.weekday == k;
    });
  }
}

//초단위 분단위로 변환
function min(sec) {
  return sec * 60000;
}
