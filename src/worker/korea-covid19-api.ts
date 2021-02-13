import { parentPort } from "worker_threads";
import get_covid19_data from "../modules/korea-covid-19-api/get_covid19_data";
const AI_model = require("../../brainjs/covid_19_model.json");
import AI_data from "../modules/korea-covid-19-api/get_ai_data";
import { update_check } from "../modules/common_modules";

(async () => {
  const covid19_info: any[][] = await get_covid19_data();
  update_check("Covid19", covid19_info);
  const total_info = covid19_info[covid19_info.length - 1];
  const ai_data = new AI_data(total_info, AI_model, 10, 10);
  covid19_info.push(ai_data.make_test_ai_data());
  covid19_info.push(ai_data.make_ai_data());
  parentPort!.postMessage(covid19_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
