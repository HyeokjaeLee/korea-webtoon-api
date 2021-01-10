import { parentPort } from "worker_threads";
import { get_buy_data } from "../modules/get_buys_data";
const buy_data_url = "http://openinsider.com/insider-purchases-25k";

(async () => {
  const buy_data = await get_buy_data(buy_data_url);
  console.log("Trade data update was successful (" + new Date() + ")");
  parentPort!.postMessage(buy_data); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
