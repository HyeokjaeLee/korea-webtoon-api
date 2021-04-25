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
exports.Stock = void 0;
var yahooStockPrices = require("yahoo-stock-prices");
var checking_1 = require("../function/checking");
var Stock = /** @class */ (function () {
    function Stock(ticker_list) {
        var _this = this;
        this.newDate = new Date();
        this.today = {
            year: this.newDate.getFullYear(),
            month: this.newDate.getMonth(),
            day: this.newDate.getDate(),
        };
        this.ticker_list = [];
        this.errorTicker = [];
        this.getStockPrices = function (ticker) { return __awaiter(_this, void 0, void 0, function () {
            var stockPrices, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this.filter_stockPrices;
                        return [4 /*yield*/, yahooStockPrices.getHistoricalPrices(0, 0, 0, this.today.month, this.today.day, this.today.year, ticker, "1d")];
                    case 1:
                        stockPrices = _a.apply(this, [_b.sent()]);
                        if (stockPrices.length != 0) {
                            return [2 /*return*/, { ticker: ticker, data: stockPrices }];
                        }
                        else
                            this.errorTicker.push(ticker);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        this.errorTicker.push(ticker);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.filter_stockPrices = function (yahooStockPrices) {
            var filteredStockPrices = [];
            yahooStockPrices.forEach(function (data) {
                if (checking_1.isExists(data.close)) {
                    var date = _this.seconds2dateForm(data.date);
                    filteredStockPrices.push({
                        date: date,
                        open: data.open,
                        high: data.high,
                        low: data.low,
                        close: data.close,
                        volume: data.volume,
                        adjclose: data.adjclose,
                    });
                }
            });
            return filteredStockPrices;
        };
        this.seconds2dateForm = function (seconds) {
            var calcuBaseDate = "1970-1-1";
            var date = new Date(calcuBaseDate);
            date.setSeconds(date.getSeconds() + seconds);
            return date;
        };
        this.get_stock_data = function () { return __awaiter(_this, void 0, void 0, function () {
            var stockDataArray, final_stockDataArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stockDataArray = this.ticker_list.map(function (ticker) {
                            return _this.getStockPrices(ticker);
                        });
                        return [4 /*yield*/, Promise.all(stockDataArray)];
                    case 1:
                        _a.sent(); //병렬처리를 위해 사용
                        final_stockDataArray = [];
                        stockDataArray.forEach(function (_stockData) {
                            _stockData.then(function (_stockData) {
                                if (_stockData != undefined) {
                                    final_stockDataArray.push({
                                        ticker: _stockData.ticker,
                                        data: _stockData.data,
                                    });
                                }
                            });
                        });
                        return [2 /*return*/, final_stockDataArray];
                }
            });
        }); };
        this.ticker_list = ticker_list;
    }
    return Stock;
}());
exports.Stock = Stock;
var test = function () { return __awaiter(void 0, void 0, void 0, function () {
    var test, test2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                test = new Stock(["MYF", "JOL", "CL", "TEST"]);
                return [4 /*yield*/, test.get_stock_data()];
            case 1:
                test2 = _a.sent();
                console.log(test2);
                return [2 /*return*/];
        }
    });
}); };
