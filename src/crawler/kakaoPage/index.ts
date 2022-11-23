import { requestWebtoonsByDayTabUid } from './requestWebtoonsByDayTabUid';
import { DayTabUid } from './requestWebtoonsByDayTabUid';
import { requestAuthorsOfWebtoon } from './requestAuthorsOfWebtoon';
import { standardizeKakaoPageWebtoons } from './standardizeKakaoPageWebtoons';
import { WebtoonWeek, Webtoon } from '../../types';

export const KAKAO_PAGE_API_URL = 'https://page.kakao.com/graphql';

export const getKakaoPageWebtoons = async () => {
  const webtoons: Webtoon[] = [];
  const DayTabNames = Object.values(DayTabUid).filter(
    (value) => typeof value === 'string',
  ) as string[];

  for (const DayTabName of DayTabNames) {
    const kakaoPageWebtoonsOfDay = await requestWebtoonsByDayTabUid(
      DayTabUid[DayTabName],
    );

    for (const kakaoPageWebtoon of kakaoPageWebtoonsOfDay) {
      const author = await requestAuthorsOfWebtoon(
        kakaoPageWebtoon.eventLog.eventMeta.id,
      );

      const webtoon = standardizeKakaoPageWebtoons(
        kakaoPageWebtoon,
        author,
        WebtoonWeek[DayTabName],
      );

      webtoons.push(webtoon);
    }
  }
  return webtoons;
};
