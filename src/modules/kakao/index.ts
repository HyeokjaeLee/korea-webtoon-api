import type { NormalizedWebtoon } from '@/database/entity';
import {
  KAKAO_PLACEMENT,
  getTicketInfo,
  getWebtoonListByPlacement,
} from './functions/kakaoApi';
import {
  TempNormalizedWebtoon,
  normalizeWebtoonList,
} from './functions/normalizeWebtoon';

const WEEKDAY_LIST = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
const LIMIT_QUEUE = 10;

export const getKakaoWebtoonList = async () => {
  const originalWeeklyWebtoonsList = await Promise.all(
    WEEKDAY_LIST.map(async (weekday) => {
      const { data } = await getWebtoonListByPlacement(
        KAKAO_PLACEMENT[weekday],
      );

      return normalizeWebtoonList({
        response: data,
        isEnd: false,
        updateDay: weekday,
      });
    }),
  );

  const tempNormalizedWeeklyWebtoonMap = new Map<
    number,
    TempNormalizedWebtoon
  >();

  originalWeeklyWebtoonsList.forEach((webtoonList) =>
    webtoonList.forEach((webtoon) => {
      const { id, updateDays } = webtoon;

      const duplicatedWebtoon = tempNormalizedWeeklyWebtoonMap.get(id);

      //! 요일별 중복 웹툰 제거
      if (duplicatedWebtoon)
        return duplicatedWebtoon.updateDays.push(...updateDays);

      return tempNormalizedWeeklyWebtoonMap.set(id, webtoon);
    }),
  );

  //! 완결 웹툰은 따로 요청후 정형화 후 요일별 웹툰과 합쳐줌
  const tempNormalizedWebtoonList = await getWebtoonListByPlacement(
    KAKAO_PLACEMENT.COMPLETE,
  )
    .then(({ data }) =>
      normalizeWebtoonList({
        isEnd: true,
        response: data,
      }),
    )
    .then((finishedWebtoon) => {
      const weeklyWebtoonList = Array.from(
        tempNormalizedWeeklyWebtoonMap.values(),
      );

      return [...weeklyWebtoonList, ...finishedWebtoon];
    });

  let queue = 0;

  const normalizedWebtoonList: NormalizedWebtoon[] = await Promise.all(
    tempNormalizedWebtoonList.map(
      async ({ freeWaitHour, id: kakaoWebtoonId, ...webtoon }) => {
        const id = `kakao_${kakaoWebtoonId}`;

        if (freeWaitHour !== undefined)
          return { id, ...webtoon, freeWaitHour, isFree: true };

        //! 요청 제한을 위한 큐, 카카오 동시 요청 제한 회피
        if (queue > LIMIT_QUEUE) {
          await new Promise<void>((resolve) =>
            setInterval(() => {
              if (queue <= LIMIT_QUEUE) resolve();
            }, 1_000),
          );
        }
        queue += 1;

        const { data } = await getTicketInfo(kakaoWebtoonId);

        queue -= 1;

        const waitInterval = data.data.waitForFree?.interval.replace(/\D/g, '');

        return {
          ...webtoon,
          id,
          isFree: !!waitInterval,
          freeWaitHour: waitInterval ? Number(waitInterval) : null,
        };
      },
    ),
  );

  return normalizedWebtoonList;
};
