import {
  getDailyPlusWebtoonList,
  getFinishedWebtoonList,
  getWeekleyWebtoonList,
} from './function/naverApi';
import { normalizeWebtoon } from './function/normalizeWebtoon';

enum UpdateWeek {
  MONDAY = '월',
  TUESDAY = '화',
  WEDNESDAY = '수',
  THURSDAY = '목',
  FRIDAY = '금',
  SATURDAY = '토',
  SUNDAY = '일',
}

export const getNaverWebtoonList = async () => {
  const weekleyWebtoonMap = new Map<number, NormalizedWebtoon>();

  const {
    data: { titleListMap: weekleyWebtoonTitleMap },
  } = await getWeekleyWebtoonList();

  for (const weekday in weekleyWebtoonTitleMap) {
    const _weekday = weekday as keyof typeof weekleyWebtoonTitleMap;
    const weekdayWebtoonList = weekleyWebtoonTitleMap[_weekday];

    weekdayWebtoonList.forEach(({ titleId, ...webtoon }) => {
      const duplicatedWebtoon = weekleyWebtoonMap.get(titleId);

      //! 각 요일에 중복된 웹툰이 노출될수 있음
      if (duplicatedWebtoon) {
        duplicatedWebtoon.updateWeek?.push(UpdateWeek[_weekday]);
      }

      const updateWeekday = UpdateWeek[_weekday];

      return weekleyWebtoonMap.set(titleId, {
        ...normalizeWebtoon({
          ...webtoon,
          titleId,
        }),
        updateWeek: [updateWeekday],
      });
    });
  }

  const weekleyWebtoonList = Array.from(weekleyWebtoonMap.values());

  const {
    data: { titleList: dailyPlusWebtoonTitleList },
  } = await getDailyPlusWebtoonList();

  const dailyPlusWebtoonList = dailyPlusWebtoonTitleList.map((webtoon) => ({
    ...normalizeWebtoon(webtoon),
    updateWeek: null,
  }));

  for (let page = 1, totalPages: number; page <= totalPages; page++) {
    const {
      data: { pageInfo },
    } = await getFinishedWebtoonList(page);

    totalPages = pageInfo.totalPages;
  }
};
