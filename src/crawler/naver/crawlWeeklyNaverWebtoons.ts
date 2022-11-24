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
        (savedWebtoon) =>
          savedWebtoon.title === webtoon.title &&
          savedWebtoon.author === webtoon.author,
      );

      if (savedWebtoon) {
        const { updateDays } = savedWebtoon;

        const [updateDay] = webtoon.updateDays;

        updateDays.includes(updateDay) || updateDays.push(updateDay);

        if (updateDays.includes(UpdateDay.FINISHED)) {
          savedWebtoon.updateDays = [UpdateDay.FINISHED];
        }
      } else {
        webtoonList.push(webtoon);
      }
    }
  }

  return webtoonList;
};
