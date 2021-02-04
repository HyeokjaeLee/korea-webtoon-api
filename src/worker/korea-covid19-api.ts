import { parentPort } from "worker_threads";
import get_covid19_data from "../modules/korea-covid-19-api/get_covid19_data";
import { update_check } from "../modules/common_modules";

(async () => {
  const covid19_info: object[] = await get_covid19_data();
  update_check("Covid19", covid19_info);
  parentPort!.postMessage(covid19_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
