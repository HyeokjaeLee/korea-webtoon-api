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

    //* 비동기적으로 처리
    await Promise.all(
      kakaoPageWebtoonsOfDay.map(async (kakaoPageWebtoon) => {
        await requestAuthorsOfWebtoon(
          kakaoPageWebtoon.eventLog.eventMeta.id,
        ).then((author: string) => {
          const webtoon = standardizeKakaoPageWebtoons(
            kakaoPageWebtoon,
            author,
            [UpdateDay[dayTabName]],
          );

          const savedWebtoon = webtoons.find(
            (savedWebtoon) =>
              savedWebtoon.title === webtoon.title &&
              savedWebtoon.author === author,
          );

          //* 중복 저장 방지
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
        });
      }),
    );
  }

  return webtoons;
};
