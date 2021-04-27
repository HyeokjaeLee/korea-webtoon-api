import { parentPort } from "worker_threads";
import { get_opne_insider_data } from "../components/open-insider-crawler";
import { Stock } from "../components/stock-info";
import { checkUpdates } from "../function/checking";
import * as InsiderTrade from "../type/type.insider-trade";

(async () => {
  let insiderTradeArray: InsiderTrade.OpenInsider[] = await get_opne_insider_data();
  const uniqueTickerList = Array.from(
      new Set(insiderTradeArray.map((_insiderTrade) => _insiderTrade.ticker))
    ),
    stock = new Stock(uniqueTickerList),
    stockData = await stock.get_stock_data();
  //정보가 없거나 오류가 있는 Ticker 정보 제외
  insiderTradeArray = insiderTradeArray.filter((_insiderTrade) =>
    stock.errorTicker.includes(_insiderTrade.ticker) ? false : true
  );
  const inserTradeData = {
    insiderTradeInfo: insiderTradeArray,
    stockData: stockData,
  };
  checkUpdates("Insider Trade", inserTradeData);
  console.log("Error Ticker : " + stock.errorTicker);
  parentPort!.postMessage(inserTradeData);
  parentPort!.close();
})();

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
