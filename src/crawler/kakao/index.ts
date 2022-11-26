import { getFinishedKakaoWebtoons } from './getFinishedKakaoWebtoons';
import { getWeeklyKakaoWebtoons } from './getWeeklyKakaoWebtoons';
import type { Webtoon } from '../../types';
import { consoleWithTime } from 'utils';

export const getKakaoWebtoons = async () => {
  consoleWithTime('카카오 웹툰 크롤링 시작');
  const webtoons: Webtoon[] = [];
  const originalTypes: ('novel' | 'general')[] = ['novel', 'general'];
  for (const originalType of originalTypes) {
    const [weeklyWebtoons, finishedWebtoons] = await Promise.all([
      getWeeklyKakaoWebtoons(originalType),
      getFinishedKakaoWebtoons(originalType),
    ]);

    webtoons.push(...weeklyWebtoons, ...finishedWebtoons);
  }
  consoleWithTime('카카오 웹툰 크롤링 종료');
  return webtoons;
};
