import { parentPort } from "worker_threads";
import get_buy_data from "./components/get_buys_data";
import { getTotalStockInfo } from "./components/get_stock_data";
import { checkUpdates } from "../modules/checking";
import type { A_trade_data } from "../modules/types";
const buy_data_url = "http://openinsider.com/insider-purchases-25k";

(async () => {
  const insiderTradeList: A_trade_data[] = await get_buy_data(buy_data_url);
  const stockData = await getTotalStockInfo(insiderTradeList);
  //error ticker에 있는 값 예외 처리
  const filteredInsiderTradeList = insiderTradeList.filter((data: A_trade_data) => {
    if (stockData.errorTicker.includes(data.ticker)) {
      return false;
    } else {
      return true;
    }
  });
  const trade_info = {
    insiderTradeList: filteredInsiderTradeList,
    stockData: stockData.stockData,
  };
  checkUpdates("Insider Trade", trade_info);
  console.log("Error Ticker : " + stockData.errorTicker);
  parentPort!.postMessage(trade_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
