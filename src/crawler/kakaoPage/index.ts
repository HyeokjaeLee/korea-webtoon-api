import { requestWebtoonsByDayTabUid } from './requestWebtoonsByDayTabUid';
import { DayTabUid } from './requestWebtoonsByDayTabUid';
import { requestAuthorsOfWebtoon } from './requestAuthorsOfWebtoon';
import { standardizeKakaoPageWebtoons } from './standardizeKakaoPageWebtoons';
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

    for (const kakaoPageWebtoon of kakaoPageWebtoonsOfDay) {
      const author = await requestAuthorsOfWebtoon(
        kakaoPageWebtoon.eventLog.eventMeta.id,
      );

      const webtoon = standardizeKakaoPageWebtoons(kakaoPageWebtoon, author, [
        UpdateDay[dayTabName],
      ]);

      const savedWebtoon = webtoons.find(
        (savedWebtoon) =>
          savedWebtoon.title === webtoon.title &&
          savedWebtoon.author === author,
      );

      /** 중복 저장 방지**/
      if (savedWebtoon) {
        const savedAdditional = savedWebtoon.additional;
        const {
          additional,
          updateDays: [updateDay],
        } = webtoon;
        savedAdditional.rest = savedAdditional.rest || additional.rest;
        savedAdditional.up = savedAdditional.up || additional.up;
        savedAdditional.new = savedAdditional.new || additional.new;

        const savedWebtoonUpdateDay = savedWebtoon.updateDays;

        if (!savedWebtoonUpdateDay.includes(updateDay)) {
          savedWebtoonUpdateDay.push(updateDay);
        }

        if (savedWebtoonUpdateDay.includes(UpdateDay.FINISHED)) {
          savedWebtoon.updateDays = [UpdateDay.FINISHED];
        }
      } else {
        webtoons.push(webtoon);
      }
    }
  }

  return webtoons;
};
