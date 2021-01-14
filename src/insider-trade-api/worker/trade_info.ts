import { parentPort } from "worker_threads";
import { get_buy_data } from "../modules/get_buys_data";
import { get_stock_data } from "../modules/get_stock_data";
const buy_data_url = "http://openinsider.com/insider-purchases-25k";

(async () => {
  const buy_data = await get_buy_data(buy_data_url);
  const stock_data = await get_stock_data(buy_data);
  console.log("Trade data update was successful (" + new Date() + ")");
  parentPort!.postMessage(stock_data); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
