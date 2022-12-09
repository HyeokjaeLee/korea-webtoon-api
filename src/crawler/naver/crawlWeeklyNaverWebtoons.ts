import { UpdateDay, Webtoon } from '../../types';
import { crawlNaverWebtoons } from './crawlNaverWebtoons';

export const crawlWeeklyNaverWebtoons = async () => {
  const dayList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const webtoonList: Webtoon[] = [];

  for (const day of dayList) {
    const webtoons = await crawlNaverWebtoons(
      'weekday',
      `week=${day.toLowerCase()}`,
      [UpdateDay[day]],
    );

    for (const webtoon of webtoons) {
      const savedWebtoon = webtoonList.find(
        ({ webtoonId }) => webtoonId === webtoon.webtoonId,
      );

      if (savedWebtoon) {
        const [updateDay] = webtoon.updateDays;

        savedWebtoon.updateDays = [
          ...new Set([...savedWebtoon.updateDays, updateDay]),
        ];
      } else {
        webtoonList.push(webtoon);
      }
    }
  }

  return webtoonList;
};
