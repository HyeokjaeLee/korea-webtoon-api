"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var worker_threads_1 = require("worker_threads");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var http_1 = __importDefault(require("http"));
//호스팅 서버 슬립 방지
setInterval(function () {
    http_1.default.get("http://toy-projects-api.herokuapp.com/");
}, sec(600));
//--------------------------------------------------------------------------------
//main 실행 함수
var main = function () {
    //호스팅 시작과 동시에 전체 데이터 1회 업데이트
    hosting_start();
    webtoon_update();
    trade_update();
    //1분 간격으로 전체 data 업데이트
    setInterval(function () {
        webtoon_update();
        trade_update();
    }, sec(60));
};
//--------------------------------------------------------------------------------
//webtoon업데이트 워커 실행
var webtoon_info_json = [];
var webtoon_update = function () {
    var workerPath_webtoon_info = path_1.default.join(__dirname, "./korean-webtoon-api/worker/webtoon_info.js");
    var webtoon_info = new worker_threads_1.Worker(workerPath_webtoon_info);
    webtoon_info.on("message", function (webtoon_info) {
        webtoon_info_json = webtoon_info;
        webtoon_info_json.sort(function (a, b) {
            return a.title < b.title ? -1 : 1;
        });
    });
};
var trade_info_json = [];
var trade_update = function () {
    var workerPath_trade_info = path_1.default.join(__dirname, "./insider-trade-api/worker/trade_info.js");
    var trade_info = new worker_threads_1.Worker(workerPath_trade_info);
    trade_info.on("message", function (trade_info) {
        trade_info_json = trade_info;
    });
};
//json 형식으로 웹에 배포
var hosting_start = function () {
    var app = express_1.default();
    app.use(cors_1.default());
    app.get("/webtoon/all", function (request, response) {
        response.json(webtoon_info_json);
    });
    app.get("/insidertrade/lists", function (request, response) {
        response.json(trade_info_json);
    });
    app.listen(process.env.PORT || 8080, function () {
        console.log("webtoon api hosting started on port 8080.");
    });
};
//ms단위 s단위로 변환
function sec(time) {
    return time * 1000;
}
main();
