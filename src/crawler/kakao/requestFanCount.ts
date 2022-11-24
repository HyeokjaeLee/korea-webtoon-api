import axios from 'axios';
const WEBTOON_DETAIL_INFO_API_URL =
  'https://gateway-kw.kakao.com/decorator/v1/decorator/contents';

export const requestFanCount = async (webtoonId: number) => {
  const res = await axios.get(`${WEBTOON_DETAIL_INFO_API_URL}/${webtoonId}`);

  const likeCount: number = res.data.data.statistics.likeCount;

  const fanCount = Math.floor(likeCount / 1000);

  return fanCount ? fanCount : null;
};
