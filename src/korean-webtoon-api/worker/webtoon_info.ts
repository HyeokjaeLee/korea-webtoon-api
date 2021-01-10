import { parentPort } from "worker_threads";
import { get_naver_webtoon } from "../modules/get_naver_webtoon";
import { get_daum_webtoon } from "../modules/get_daum_webtoon";

(async () => {
  const naver_info: object[] = await get_naver_webtoon();
  const daum_info: object[] = get_daum_webtoon();
  let webtoon_info: object[] = naver_info.concat(daum_info);
  console.log("Webtoon data update was successful (" + new Date() + ")");
  parentPort!.postMessage(webtoon_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
