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
var common_modules_1 = require("./modules/common_modules");
var index_modules_1 = require("./modules/index_modules");
var exp = express_1.default();
exp.use(cors_1.default());
index_modules_1.keep_host("http://toy-projects-api.herokuapp.com/");
var korea_covid19_dir = path_1.default.join(__dirname, "./worker/korea-covid19-api.js");
var insider_trade_dir = path_1.default.join(__dirname, "./worker/insider-trade-api.js");
var korean_webtoon_dir = path_1.default.join(__dirname, "./worker/korean-webtoon-api.js");
//------------------------------------------------------------------------
var main = function () {
    common_modules_1.setTimer_loop(common_modules_1.ms2hour(12), update_insider_trade_api);
    common_modules_1.setTimer_loop(common_modules_1.ms2minute(10), update_korean_webtoon_api);
    common_modules_1.setTimer_loop(common_modules_1.ms2hour(1), update_korea_covid19_api);
    index_modules_1.hosting(8080);
};
//------------------------------------------------------------------------
var update_korea_covid19_api = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_modules_1.get_data_from_worker(korea_covid19_dir)];
            case 1:
                data = _a.sent();
                data.map(function (data) {
                    var covid_data = data.slice(1);
                    var region = data[0];
                    index_modules_1.create_router("/covid19/korea/" + region, covid_data);
                });
                return [2 /*return*/];
        }
    });
}); };
var update_insider_trade_api = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, insider_trade_list_data, stock_data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_modules_1.get_data_from_worker(insider_trade_dir)];
            case 1:
                data = _a.sent();
                insider_trade_list_data = data.insider_trade_list;
                stock_data = data.stock_data;
                stock_data.map(function (data) {
                    var stock_data = data.slice(1);
                    var ticker = data[0];
                    index_modules_1.create_router("/insidertrade/" + ticker, stock_data);
                });
                index_modules_1.create_router("/insidertrade/list", insider_trade_list_data);
                return [2 /*return*/];
        }
    });
}); };
var update_korean_webtoon_api = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_modules_1.get_data_from_worker(korean_webtoon_dir)];
            case 1:
                data = _a.sent();
                data.sort(function (a, b) {
                    return a.title < b.title ? -1 : 1;
                });
                index_modules_1.create_router("/webtoon/all", data);
                return [2 /*return*/];
        }
    });
}); };
main();
