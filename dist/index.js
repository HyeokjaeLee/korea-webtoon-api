"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    //5분 간격으로 전체 data 업데이트
    setInterval(function () {
        webtoon_update();
    }, sec(300));
};
//한시간 간격으로 주식데이터 업데이트
setImmediate(function () {
    trade_update();
}, sec(3600));
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
var insider_trade_info;
var stock_info;
var trade_update = function () { return __awaiter(void 0, void 0, void 0, function () {
    var trade_info_zip, workerPath_trade_info, trade_info;
    return __generator(this, function (_a) {
        workerPath_trade_info = path_1.default.join(__dirname, "./insider-trade-api/worker/trade_info.js");
        trade_info = new worker_threads_1.Worker(workerPath_trade_info);
        trade_info.on("message", function (trade_info) {
            trade_info_zip = trade_info;
            insider_trade_info = trade_info_zip.insider_trade_list;
            stock_info = trade_info_zip.stock_data;
        });
        return [2 /*return*/];
    });
}); };
//json 형식으로 웹에 배포
var hosting_start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, host_stock;
    return __generator(this, function (_a) {
        app = express_1.default();
        app.use(cors_1.default());
        host_stock = function () {
            stock_info.map(function (data) {
                var stock_data = data.slice(1);
                app.get("/insidertrade/" + data[0], function (request, response) {
                    response.json(stock_data);
                });
            });
        };
        setTimeout(function () {
            host_stock();
        }, sec(30));
        setInterval(function () {
            host_stock();
        }, sec(3600));
        app.get("/webtoon/all", function (request, response) {
            response.json(webtoon_info_json);
        });
        app.get("/insidertrade/list", function (request, response) {
            response.json(insider_trade_info);
        });
        app.listen(process.env.PORT || 8080, function () {
            console.log("webtoon api hosting started on port 8080.");
        });
        return [2 /*return*/];
    });
}); };
//ms단위 s단위로 변환
function sec(time) {
    return time * 1000;
}
main();
