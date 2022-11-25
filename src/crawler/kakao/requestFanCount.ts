import axios from 'axios';
const WEBTOON_DETAIL_INFO_API_URL =
  'https://gateway-kw.kakao.com/decorator/v1/decorator/contents';

export const requestFanCount = async (webtoonId: number, errorCount = 0) => {
  try {
    const res = await axios.get(`${WEBTOON_DETAIL_INFO_API_URL}/${webtoonId}`);

    const likeCount: number = res.data.data.statistics.likeCount;

    const fanCount = Math.floor(likeCount / 1000);

    return fanCount ? fanCount : null;
  } catch {
    errorCount++;
    console.log('try again request Kakao fan count', errorCount);
    if (errorCount > 10) {
      throw new Error('can not request kakao fan count');
    }
    return requestFanCount(webtoonId, errorCount);
  }
};
