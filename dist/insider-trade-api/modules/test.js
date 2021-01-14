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
Object.defineProperty(exports, "__esModule", { value: true });
var yahooStockPrices = require("yahoo-stock-prices");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var get_json_data = function (url) {
    var xmlhttp = new XMLHttpRequest();
    var json_data = "";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                json_data = JSON.parse(xmlhttp.responseText);
            }
            catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };
    xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
    xmlhttp.send();
    return json_data;
};
var get_a_data = function (ticker, start_date, end_date) { return __awaiter(void 0, void 0, void 0, function () {
    var date_arr, start_date_arr, end_date_arr, stock_original_data, stock_processed_data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date_arr = function (date_str) {
                    var date = new Date(date_str);
                    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
                };
                if (start_date != undefined) {
                    start_date_arr = date_arr(start_date);
                }
                else {
                    start_date_arr = { year: 0, month: 0, day: 0 };
                }
                if (end_date != undefined) {
                    end_date_arr = date_arr(end_date);
                }
                else {
                    end_date_arr = date_arr(String(new Date()));
                }
                return [4 /*yield*/, yahooStockPrices.getHistoricalPrices(start_date_arr.month, start_date_arr.day, start_date_arr.year, end_date_arr.month, end_date_arr.day, end_date_arr.year, ticker, "1d")];
            case 1:
                stock_original_data = _a.sent();
                stock_processed_data = stock_original_data.map(function (data) {
                    var date = new Date("1970-1-1");
                    date.setSeconds(date.getSeconds() + data.date);
                    return {
                        date: date,
                        open: data.open,
                        high: data.high,
                        low: data.low,
                        close: data.close,
                    };
                });
                return [2 /*return*/, stock_processed_data];
        }
    });
}); };
var test = function () { return __awaiter(void 0, void 0, void 0, function () {
    var test_json, prices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                test_json = get_json_data("https://toy-projects-api.herokuapp.com/insidertrade/lists");
                return [4 /*yield*/, get_a_data(test_json[0].ticker)];
            case 1:
                prices = _a.sent();
                console.log(prices);
                return [2 /*return*/];
        }
    });
}); };
test();
