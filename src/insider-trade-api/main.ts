import { parentPort } from "worker_threads";
import get_buy_data from "./modules/get_buys_data";
import get_stock_data from "./modules/get_stock_data";
import { checkUpdates } from "../modules/checkUpdates";
import type { A_trade_data } from "./modules/types";
const buy_data_url = "http://openinsider.com/insider-purchases-25k";

(async () => {
  const buy_data: any = await get_buy_data(buy_data_url);
  const stock_data = await get_stock_data(buy_data);
  //error ticker에 있는 값 예외 처리
  const clean_buy_data = buy_data.filter((data: A_trade_data) => {
    if (stock_data.error_ticker.includes(data.ticker)) {
      return false;
    } else {
      return true;
    }
  });
  const trade_info = { insider_trade_list: clean_buy_data, stock_data: stock_data.stock_data };
  checkUpdates("Insider Trade", trade_info);
  console.log("Error Ticker : " + stock_data.error_ticker);
  parentPort!.postMessage(trade_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
