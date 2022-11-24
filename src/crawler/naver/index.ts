export const NAVER_WEBTOON_URL = 'https://m.comic.naver.com';
import { crawlDailyNaverWebtoons } from './crawlDailyNaverWebtoons';
import { crawlFinishedNaverWebtoons } from './crawlFinishedNaverWebtoons';
import { crawlWeeklyNaverWebtoons } from './crawlWeeklyNaverWebtoons';

export const getNaverWebtoons = async () => {
  const [weeklyWebtoons, dailyWebtoons, finishedWebtoons] = await Promise.all([
    crawlWeeklyNaverWebtoons(),
    crawlDailyNaverWebtoons(),
    crawlFinishedNaverWebtoons(),
  ]);

  return [...weeklyWebtoons, ...dailyWebtoons, ...finishedWebtoons];
};
