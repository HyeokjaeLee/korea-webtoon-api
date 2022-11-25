import { requestWebtoonsByDayTabUid } from './requestWebtoonsByDayTabUid';
import { DayTabUid } from './requestWebtoonsByDayTabUid';
import { requestAuthorsOfWebtoon } from './requestAuthorsOfWebtoon';
import { standardizeKakaoPageWebtoon } from './standardizeKakaoPageWebtoon';
import { Webtoon, UpdateDay } from '../../types';

export const KAKAO_PAGE_API_URL = 'https://page.kakao.com/graphql';

export const getKakaoPageWebtoons = async () => {
  const webtoons: Webtoon[] = [];
  const dayTabNames = Object.values(DayTabUid).filter(
    (value) => typeof value === 'string',
  ) as string[];

  for (const dayTabName of dayTabNames) {
    const kakaoPageWebtoonsOfDay = await requestWebtoonsByDayTabUid(
      DayTabUid[dayTabName],
    );

    //! 비동기적으로 처리하면 카카오 페이지 서버에서 막는 횟수가 많아짐
    for (const kakaoPageWebtoon of kakaoPageWebtoonsOfDay) {
      const author = await requestAuthorsOfWebtoon(
        kakaoPageWebtoon.eventLog.eventMeta.id,
      );

      const webtoon = standardizeKakaoPageWebtoon(kakaoPageWebtoon, author, [
        UpdateDay[dayTabName],
      ]);

      //* 중복 저장 방지
      const savedWebtoon = webtoons.find(
        ({ webtoonId }) => webtoonId === webtoon.webtoonId,
      );

      if (savedWebtoon) {
        const { updateDays } = savedWebtoon;
        const [updateDay] = webtoon.updateDays;

        updateDays.includes(updateDay) || updateDays.push(updateDay);

        if (updateDays.includes(UpdateDay.FINISHED)) {
          savedWebtoon.updateDays = [UpdateDay.FINISHED];
        }
      } else {
        webtoons.push(webtoon);
      }
    }
  }

  return webtoons;
};
