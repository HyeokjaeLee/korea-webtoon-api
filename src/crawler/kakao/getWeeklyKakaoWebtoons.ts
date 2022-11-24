import { requestKakaoWebtoons } from './requestKakaoWebtoons';
import { requestFanCount } from './requestFanCount';
import { requestSingularityInfo } from './requestSingularityInfo';
import { standardizeKakaoWebtoon } from './standardizeKakaoWebtoon';
import { UpdateDay, Webtoon } from '../../types';

export const getWeeklyKakaoWebtoons = async (
  originalType: 'novel' | 'general',
) => {
  const weeklyWebtoonsList = await requestKakaoWebtoons(
    `/pages/${originalType}-weekdays`,
    true,
  );

  const webtoons: Webtoon[] = [];

  for (const weeklyWebtoons of weeklyWebtoonsList) {
    const updateDay = {
      월: UpdateDay.MON,
      화: UpdateDay.TUE,
      수: UpdateDay.WED,
      목: UpdateDay.THU,
      금: UpdateDay.FRI,
      토: UpdateDay.SAT,
      일: UpdateDay.SUN,
    }[weeklyWebtoons.title];

    const kakaoWebtoons = weeklyWebtoons.cardGroups[0].cards;

    await Promise.all(
      kakaoWebtoons.map(async (kakaoWebtoon) => {
        const { id } = kakaoWebtoon.content;
        const [fanCount, singularityInfo] = await Promise.all([
          requestFanCount(id),
          requestSingularityInfo(id),
        ]);

        if (updateDay) {
          const webtoon = standardizeKakaoWebtoon(
            kakaoWebtoon,
            [updateDay],
            fanCount,
            singularityInfo,
          );

          const savedWebtoon = webtoons.find(
            (savedWebtoon) =>
              savedWebtoon.title === webtoon.title &&
              savedWebtoon.author === webtoon.author,
          );

          if (savedWebtoon) {
            savedWebtoon.updateDays.push(...webtoon.updateDays);
          } else {
            webtoons.push(webtoon);
          }
        }
      }),
    );
  }

  return webtoons;
};
