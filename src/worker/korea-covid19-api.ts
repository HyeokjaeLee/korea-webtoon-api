import { parentPort } from "worker_threads";
import get_covid19_data from "../modules/korea-covid-19-api/get_covid19_data";

(async () => {
  const covid19_info: object[] = await get_covid19_data();
  console.log("Covid19 data update was successful (" + new Date() + ")");
  parentPort!.postMessage(covid19_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
