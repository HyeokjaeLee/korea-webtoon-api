import axios from 'axios';
import { consoleWithTime } from 'utils';
const WEBTOON_DETAIL_INFO_API_URL =
  'https://gateway-kw.kakao.com/decorator/v1/decorator/contents';

export const requestFanCount = async (id: number, errorCount = 0) => {
  try {
    const res = await axios.get(`${WEBTOON_DETAIL_INFO_API_URL}/${id}`);

    const likeCount: number = res.data.data.statistics.likeCount;

    const fanCount = Math.floor(likeCount / 10000);

    return fanCount ? fanCount : null;
  } catch {
    errorCount++;
    const errorMessage = `카카오 웹툰 id:${id} fanCount 요청 실패`;
    consoleWithTime(`${errorMessage}, ${errorCount}번째 재시도`);
    if (errorCount > 10) {
      throw new Error(errorMessage);
    }
    return requestFanCount(id, errorCount);
  }
};
