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
var worker_threads_1 = require("worker_threads");
var open_insider_crawler_1 = require("../components/open-insider-crawler");
var stock_info_1 = require("../components/stock-info");
var checking_1 = require("../function/checking");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var insiderTradeArray, uniqueTickerList, stock, stockData, inserTradeData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, open_insider_crawler_1.get_opne_insider_data()];
            case 1:
                insiderTradeArray = _a.sent();
                uniqueTickerList = Array.from(new Set(insiderTradeArray.map(function (_insiderTrade) { return _insiderTrade.ticker; }))), stock = new stock_info_1.Stock(uniqueTickerList);
                return [4 /*yield*/, stock.get_stock_data()];
            case 2:
                stockData = _a.sent();
                //정보가 없거나 오류가 있는 Ticker 정보 제외
                insiderTradeArray = insiderTradeArray.filter(function (_insiderTrade) {
                    return stock.errorTicker.includes(_insiderTrade.ticker) ? false : true;
                });
                inserTradeData = {
                    insiderTradeInfo: insiderTradeArray,
                    stockData: stockData,
                };
                checking_1.checkUpdates("Insider Trade", inserTradeData);
                console.log("Error Ticker : " + stock.errorTicker);
                worker_threads_1.parentPort.postMessage(inserTradeData);
                worker_threads_1.parentPort.close();
                return [2 /*return*/];
        }
    });
}); })();
/* const stockData = await getTotalStockInfo(insiderTradeList);
  //error ticker에 있는 값 예외 처리
  const filteredInsiderTradeList = insiderTradeList.filter(
    (data: A_trade_data) => {
      if (stockData.errorTicker.includes(data.ticker)) {
        return false;
      } else {
        return true;
      }
    }
  );
  const trade_info = {
    insiderTradeList: filteredInsiderTradeList,
    stockData: stockData.stockData,
  };
  checkUpdates("Insider Trade", trade_info);
  console.log("Error Ticker : " + stockData.errorTicker);
  parentPort!.postMessage(trade_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
};)();
*/
