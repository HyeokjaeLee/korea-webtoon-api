import { getFinishedKakaoWebtoons } from './getFinishedKakaoWebtoons';
import { getWeeklyKakaoWebtoons } from './getWeeklyKakaoWebtoons';
import type { Webtoon } from '../../types';

export const getKakaoWebtoons = async () => {
  const webtoons: Webtoon[] = [];
  const originalTypes: ('novel' | 'general')[] = ['novel', 'general'];
  for (const originalType of originalTypes) {
    const [weeklyWebtoons, finishedWebtoons] = await Promise.all([
      getWeeklyKakaoWebtoons(originalType),
      getFinishedKakaoWebtoons(originalType),
    ]);

    webtoons.push(...weeklyWebtoons, ...finishedWebtoons);
  }
  return webtoons;
};
