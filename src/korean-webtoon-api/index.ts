import { parentPort } from "worker_threads";
import get_naver_webtoon from "./components/get_naver_webtoon";
import get_daum_webtoon from "./components/get_daum_webtoon";
import { checkUpdates } from "../modules/checking";

(async () => {
  const naver_info: object[] = await get_naver_webtoon();
  const daum_info: object[] = get_daum_webtoon();
  const total_info: object[] = naver_info.concat(daum_info);
  total_info.sort((a: any, b: any) => {
    return a.title < b.title ? -1 : 1;
  });
  checkUpdates("Korean Webtoon", total_info);
  parentPort!.postMessage(total_info); //결과가 null될수도 있는 값에는 !붙이기
  parentPort!.close();
})();
