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
    const kakaoWebtoons = weeklyWebtoons.cardGroups[0].cards;

    //! 비동기적으로 요청시 카카오측 서버에서 요청을 막음
    for (const kakaoWebtoon of kakaoWebtoons) {
      const { id } = kakaoWebtoon.content;
      const [fanCount, singularityInfo] = await Promise.all([
        requestFanCount(id),
        requestSingularityInfo(id),
      ]);

      const updateDay = {
        월: UpdateDay.MON,
        화: UpdateDay.TUE,
        수: UpdateDay.WED,
        목: UpdateDay.THU,
        금: UpdateDay.FRI,
        토: UpdateDay.SAT,
        일: UpdateDay.SUN,
      }[weeklyWebtoons.title];

      if (updateDay) {
        const webtoon = standardizeKakaoWebtoon(
          kakaoWebtoon,
          [updateDay],
          fanCount,
          singularityInfo,
        );

        const savedWebtoon = webtoons.find(
          ({ webtoonId }) => webtoonId === webtoon.webtoonId,
        );

        if (savedWebtoon) {
          savedWebtoon.updateDays = [
            ...new Set([...savedWebtoon.updateDays, updateDay]),
          ];
        } else {
          webtoons.push(webtoon);
        }
      }
    }
  }

  return webtoons;
};
