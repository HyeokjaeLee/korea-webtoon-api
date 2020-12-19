const path = require("path");
import { Worker } from "worker_threads";
const express = require("express");
const cors = require("cors");
const http = require("http");

//--------------------------------------------------------------------------------
//main 실행 함수
const main = (): void => {
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
const hosting_start = (): void => {
  let app = express();
  app.use(cors());

  app.get(
    "/webtoon/all",
    function (request: any, response: { json: (arg0: any[]) => void }) {
      response.json(webtoon_info_json);
    },
  );

  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 8080.");
  });
};

let webtoon_info_json = [];
const webtoon_update = (): void => {
  let workerPath_webtoon_info = path.join(
    __dirname,
    "./worker/webtoon_info.js",
  );
  let webtoon_info = new Worker(workerPath_webtoon_info);
  webtoon_info.on("message", (webtoon_info) => {
    webtoon_info_json = webtoon_info;
    webtoon_info_json.sort((a, b) => {
      return a.title < b.title ? -1 : 1;
    });
  });
};

//초 단위로 변환
function sec(time: number) {
  return time * 1000;
}

main();
