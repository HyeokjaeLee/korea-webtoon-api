import {
  requestKakaoPageWebtoons,
  DayTabUid,
  KakaoPageWebtoon,
} from './requestKakaoPageWebtoons';

export const requestWebtoonsByDayTabUid = async (dayTabUid: DayTabUid) => {
  const webtoons: KakaoPageWebtoon[] = [];
  let page = 0;
  while (true) {
    try {
      const { isEnd, groups } = await requestKakaoPageWebtoons(dayTabUid, page);
      const { items } = groups[0];
      webtoons.push(...items);
      if (isEnd) break;
      else page++;
    } catch {
      console.log('request webtoons by dayTabUid error');
      break;
    }
  }
  return webtoons;
};
