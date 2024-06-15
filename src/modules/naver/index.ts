import type { NormalizedWebtoon } from '@/database/entity';
import {
  getDailyPlusWebtoonList,
  getFinishedWebtoonList,
  getweeklyWebtoonList,
} from './functions/naverApi';
import { normalizeWebtoon } from './functions/normalizeWebtoon';

enum Weekday {
  MONDAY = 'MON',
  TUESDAY = 'TUE',
  WEDNESDAY = 'WED',
  THURSDAY = 'THU',
  FRIDAY = 'FRI',
  SATURDAY = 'SAT',
  SUNDAY = 'SUN',
}

export const getNaverWebtoonList = async () => {
  const weeklyWebtoonMap = new Map<number, NormalizedWebtoon>();

  const {
    data: { titleListMap: weeklyWebtoonTitleMap },
  } = await getweeklyWebtoonList();

  for (const weekday in weeklyWebtoonTitleMap) {
    const _weekday = weekday as keyof typeof weeklyWebtoonTitleMap;
    const weekdayWebtoonList = weeklyWebtoonTitleMap[_weekday];

    weekdayWebtoonList.forEach(({ titleId, ...webtoon }) => {
      const duplicatedWebtoon = weeklyWebtoonMap.get(titleId);

      //! 각 요일에 중복된 웹툰이 노출될수 있음
      if (duplicatedWebtoon) {
        duplicatedWebtoon.updateDays?.push(Weekday[_weekday]);
      }

      const updateDay = Weekday[_weekday];

      return weeklyWebtoonMap.set(titleId, {
        ...normalizeWebtoon({
          ...webtoon,
          titleId,
        }),
        updateDays: [updateDay],
      });
    });
  }

  const weeklyWebtoonList = Array.from(weeklyWebtoonMap.values());

  const {
    data: { titleList: dailyPlusWebtoonTitleList },
  } = await getDailyPlusWebtoonList();

  const dailyPlusWebtoonList: NormalizedWebtoon[] =
    dailyPlusWebtoonTitleList.map((webtoon) => ({
      ...normalizeWebtoon(webtoon),
      updateDays: [],
    }));

  const finishedWebtoonList: NormalizedWebtoon[] = [];

  for (let page = 1, totalPages = 2; page <= totalPages; page++) {
    const {
      data: { pageInfo, titleList },
    } = await getFinishedWebtoonList(page);

    totalPages = pageInfo.totalPages;

    finishedWebtoonList.push(
      ...titleList.map((webtoon) => ({
        ...normalizeWebtoon(webtoon),
        updateDays: [],
      })),
    );
  }

  return weeklyWebtoonList.concat(dailyPlusWebtoonList, finishedWebtoonList);
};
