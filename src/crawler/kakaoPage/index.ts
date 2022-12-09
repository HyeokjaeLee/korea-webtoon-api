import { requestWebtoonsByDayTabUid } from './requestWebtoonsByDayTabUid';
import { DayTabUid } from './requestWebtoonsByDayTabUid';
import { requestAuthorsOfWebtoon } from './requestAuthorsOfWebtoon';
import { standardizeKakaoPageWebtoon } from './standardizeKakaoPageWebtoon';
import { Webtoon, UpdateDay } from '../../types';
import { consoleWithTime } from 'utils';

export const KAKAO_PAGE_API_URL = 'https://page.kakao.com/graphql';

export const getKakaoPageWebtoons = async () => {
  consoleWithTime('카카오 페이지 웹툰 크롤링 시작');
  const webtoons: Webtoon[] = [];
  const dayTabNames = Object.values(DayTabUid).filter(
    (value) => typeof value === 'string',
  ) as string[];

  for (const dayTabName of dayTabNames) {
    const kakaoPageWebtoonsOfDay = await requestWebtoonsByDayTabUid(
      DayTabUid[dayTabName],
    );

    //! 비동기적으로 처리하면 카카오 페이지 서버가 블락하는 빈도가 높아짐
    for (const kakaoPageWebtoon of kakaoPageWebtoonsOfDay) {
      const author = await requestAuthorsOfWebtoon(
        kakaoPageWebtoon.eventLog.eventMeta.id,
      );

      const webtoon = standardizeKakaoPageWebtoon(kakaoPageWebtoon, author, [
        UpdateDay[dayTabName],
      ]);

      const savedWebtoon = webtoons.find(
        ({ webtoonId }) => webtoonId === webtoon.webtoonId,
      );

      if (savedWebtoon) {
        const [updateDay] = webtoon.updateDays;

        savedWebtoon.updateDays = [
          ...new Set([...savedWebtoon.updateDays, updateDay]),
        ];
      } else {
        webtoons.push(webtoon);
      }
    }
  }

  consoleWithTime('카카오 페이지 웹툰 크롤링 완료');
  return webtoons;
};
