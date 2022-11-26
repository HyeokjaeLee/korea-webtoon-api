export const NAVER_WEBTOON_URL = 'https://m.comic.naver.com';
import { consoleWithTime } from 'utils';
import { crawlDailyNaverWebtoons } from './crawlDailyNaverWebtoons';
import { crawlFinishedNaverWebtoons } from './crawlFinishedNaverWebtoons';
import { crawlWeeklyNaverWebtoons } from './crawlWeeklyNaverWebtoons';

export const getNaverWebtoons = async (errorCount = 0) => {
  try {
    if (errorCount === 0) {
      consoleWithTime('네이버 웹툰 크롤링 시작');
    }
    const dailyWebtoons = await crawlDailyNaverWebtoons();
    const weeklyWebtoons = await crawlWeeklyNaverWebtoons();
    const finishedWebtoons = await crawlFinishedNaverWebtoons();
    consoleWithTime('네이버 웹툰 크롤링 완료');
    return [...dailyWebtoons, ...weeklyWebtoons, ...finishedWebtoons];
  } catch {
    const ERROR_MESSAGE = '네이버 웹툰 크롤링 실패';
    if (errorCount < 10) {
      errorCount++;
      consoleWithTime(`${ERROR_MESSAGE}, ${errorCount}번째 재시도`);
      return getNaverWebtoons(errorCount);
    }
    throw new Error(ERROR_MESSAGE);
  }
};
