const path = require("path");
const { Worker } = require("worker_threads");
const express = require("express");
var naver_info = [];
var daum_info = [];
var webtoon_info;
let workerPath_1 = path.join(__dirname, "./worker/naver_finished.js");
let workerPath_2 = path.join(__dirname, "./worker/naver_weekday.js");
let workerPath_3 = path.join(__dirname, "./worker/daum_all.js");

setInterval(function () {
  let naver_finished = new Worker(workerPath_1);
  naver_finished.on("message", (result_1) => {
    naver_info = result_1;
  });
}, 600000);

setTimeout(function () {
  setInterval(function () {
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
  }, 300000);
}, 1200000);

setInterval(function () {
  let daum_all = new Worker(workerPath_3);
  daum_all.on("message", (result_3) => {
    daum_info = result_3;
  });
}, 300000);

function webtoon() {
  return new Promise(function (resolve, reject) {
    var webtoon_info = naver_info.concat(daum_info);
    resolve(webtoon_info);
  });
}

async function update_json() {
  webtoon_info = await webtoon();
}

setInterval(function () {
  update_json();
  console.log(webtoon_info);
}, 60000);

function upload() {
  var app = express();
  app.get("/", function (request, response) {
    response.send(
      "<div id='test'>loading...</div><script>document.getElementById('test').innerHTML =" +
        JSON.stringify(webtoon_info) +
        ";setInterval(function () {document.getElementById('test').innerHTML =" +
        JSON.stringify(webtoon_info) +
        "}, 60000);</script>"
    );
  });
  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 8080.");
  });
}

upload();
