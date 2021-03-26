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
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var FormatConversion_1 = require("./modules/FormatConversion");
var worker_threads_1 = require("worker_threads");
var http_1 = __importDefault(require("http"));
var checking_1 = require("./modules/checking");
var FormatConversion_2 = require("./modules/FormatConversion");
var exp = express_1.default();
exp.use(cors_1.default());
var hosting_url = "http://toy-projects-api.herokuapp.com/";
//------------------------------------------------------------------------
var main = function () {
    hosting(8080);
    keepHosting(hosting_url); //호스팅 유지
    {
        exp.get("/", function (request, response) {
            if (request.query.id != undefined) {
                response.send(request.query.id);
            }
            else {
                response.send("test3");
            }
        });
    }
    //InsiderTradeAPI 부분
    {
        var insiderTradeWorker_1 = pathDir("./insider-trade-api/index.ts");
        var updateInsiderTradeAPI = function () { return __awaiter(void 0, void 0, void 0, function () {
            var insiderTrade, wokrer_data, totalStockData, listData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insiderTrade = new Router("insidertrade");
                        return [4 /*yield*/, getData_from_Worker(insiderTradeWorker_1)];
                    case 1:
                        wokrer_data = _a.sent();
                        totalStockData = wokrer_data.stockData;
                        listData = wokrer_data.insiderTradeList;
                        insiderTrade._createRouter(function (req, res) {
                            res.json(listData);
                        }, "list");
                        totalStockData.map(function (aStockData) {
                            var ticker = aStockData.ticker;
                            insiderTrade._createRouter(function (req, res) {
                                var _a, _b, _c;
                                var from = checking_1.query2Date(req.query.from);
                                var to = checking_1.query2Date(req.query.to);
                                var index = ""; //querysString으로 받은 값에 따른 필터링을 위한 구분값
                                if (from != undefined) {
                                    index = index + "From";
                                }
                                if (to != undefined) {
                                    index = index + "To";
                                }
                                var dateForm = function (date) { return Number(FormatConversion_2.convertDateFormat(date, "")); }; //stringQuery로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
                                switch (index) {
                                    case "From": {
                                        res.json((_a = aStockData.data) === null || _a === void 0 ? void 0 : _a.filter(function (info) { return dateForm(info.date) >= from; }));
                                        break;
                                    }
                                    case "To": {
                                        res.json((_b = aStockData.data) === null || _b === void 0 ? void 0 : _b.filter(function (info) { return dateForm(info.date) <= to; }));
                                        break;
                                    }
                                    case "FromTo": {
                                        res.json((_c = aStockData.data) === null || _c === void 0 ? void 0 : _c.filter(function (info) {
                                            var date = dateForm(info.date);
                                            return date >= from && date <= to;
                                        }));
                                        break;
                                    }
                                    default: {
                                        res.json(aStockData);
                                        break;
                                    }
                                }
                            }, ticker);
                        });
                        insiderTrade.createIndexRouter();
                        return [2 /*return*/];
                }
            });
        }); };
        FormatConversion_1.setTimer_loop(FormatConversion_1.ms2hour(12), updateInsiderTradeAPI);
    }
    // WebtoonAPI 부분
    {
        var webtoonWorker_1 = pathDir("./korean-webtoon-api/index.ts");
        var updateWebtoonAPI = function () { return __awaiter(void 0, void 0, void 0, function () {
            var webtoon, wokrer_data, classification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webtoon = new Router("webtoon");
                        return [4 /*yield*/, getData_from_Worker(webtoonWorker_1)];
                    case 1:
                        wokrer_data = _a.sent();
                        classification = [
                            { index: "sun", webtoon: [] },
                            { index: "mon", webtoon: [] },
                            { index: "tue", webtoon: [] },
                            { index: "wed", webtoon: [] },
                            { index: "thu", webtoon: [] },
                            { index: "fri", webtoon: [] },
                            { index: "sat", webtoon: [] },
                            { index: "finished", webtoon: [] },
                            { index: "Naver", webtoon: [] },
                            { index: "Daum", webtoon: [] },
                            { index: "all", webtoon: wokrer_data },
                        ];
                        wokrer_data.map(function (data) {
                            classification[data.weekday].webtoon.push(data);
                            switch (data.service) {
                                case "Naver":
                                    classification[8].webtoon.push(data);
                                    break;
                                case "Daum":
                                    classification[9].webtoon.push(data);
                                    break;
                            }
                        });
                        classification.map(function (data) {
                            webtoon.createRouter(data.webtoon, data.index);
                        });
                        webtoon.createIndexRouter();
                        return [2 /*return*/];
                }
            });
        }); };
        FormatConversion_1.setTimer_loop(FormatConversion_1.ms2minute(10), updateWebtoonAPI);
    }
    //Covid19API 부분
    {
        var covid19Worker_1 = pathDir("./korea-covid19-api/index.ts");
        var updateCovid19API = function () { return __awaiter(void 0, void 0, void 0, function () {
            var covid19, wokrer_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        covid19 = new Router("covid19");
                        return [4 /*yield*/, getData_from_Worker(covid19Worker_1)];
                    case 1:
                        wokrer_data = _a.sent();
                        wokrer_data.map(function (data) {
                            covid19.createRouter(data, data.region);
                        });
                        covid19.createIndexRouter();
                        return [2 /*return*/];
                }
            });
        }); };
        FormatConversion_1.setTimer_loop(FormatConversion_1.ms2hour(1), updateCovid19API);
    }
};
//------------------------------------------------------------------------
exp.get("/");
var Router = /** @class */ (function () {
    function Router(title) {
        var _this = this;
        this.routerList = [];
        this._createRouter = function (handler, name) {
            var path = "/" + _this.title;
            if (name != undefined) {
                path = path + ("/" + name);
                _this.routerList.push(path);
            }
            exp.get(path, handler);
        };
        this.createRouter = function (data, router) {
            var router_url;
            if (router != undefined) {
                router_url = "/" + _this.title + "/" + router;
                _this.routerList.push(router_url);
            }
            else {
                router_url = "/" + _this.title;
            }
            exp.get(router_url, function (req, response) {
                response.json(data);
            });
        };
        this.createIndexRouter = function () {
            console.log("routerList");
            console.log(_this.routerList);
            _this.createRouter(_this.routerList);
        };
        this.title = title;
    }
    return Router;
}());
var pathDir = function (dir) {
    return path_1.default.join(__dirname, dir.replace(".ts", ".js"));
};
var hosting = function (port) {
    exp.listen(process.env.PORT || port, function () {
        console.log();
        console.log("API hosting started on port " + port);
    });
};
var getData_from_Worker = function (dir) {
    return new Promise(function (resolve, reject) {
        var worker = new worker_threads_1.Worker(dir);
        worker.on("message", function (data) { return resolve(data); });
    });
};
var keepHosting = function (url) {
    setInterval(function () {
        http_1.default.get(url);
    }, FormatConversion_1.ms2hour(1));
};
main();
