import { crawlNaverWebtoons } from './crawlNaverWebtoons';
import { UpdateDay } from '../../types';

export const crawlDailyNaverWebtoons = async () => {
  const webtoons = await crawlNaverWebtoons('weekday', 'week=dailyPlus', [
    UpdateDay.NAVER_DAILY,
  ]);
  return webtoons;
};
