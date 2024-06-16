import type { NormalizedWebtoon, UpdateDay } from '@/database/entity';
import { getWebtoonList } from './functions/getWebtoonList';
import { getContentHomeOverview } from './functions/kakaoPageApi';

enum Weekday {
  월 = 'MON',
  화 = 'TUE',
  수 = 'WED',
  목 = 'THU',
  금 = 'FRI',
  토 = 'SAT',
  일 = 'SUN',
}

const LIMIT_QUEUE = 100;

export const getKakaoPageWebtoonList = async (): Promise<
  NormalizedWebtoon[]
> => {
  const webtoonList = await getWebtoonList();

  //! 요청 제한을 위한 큐, 카카오 페이지는 동시 요청 횟수 제한이 있는듯

  let queue = 0;

  return Promise.all(
    webtoonList.map(async ({ seriesId, ...webtoon }) => {
      if (queue > LIMIT_QUEUE) {
        await new Promise<void>((resolve) =>
          setInterval(() => {
            if (queue <= LIMIT_QUEUE) resolve();
          }, 1_000),
        );
      }
      queue += 1;

      const { content } = (await getContentHomeOverview(seriesId)).data.data
        .contentHomeOverview;

      const updateDays: UpdateDay[] = [];

      Object.keys(Weekday).forEach((key) => {
        const weekdayKor = key as keyof typeof Weekday;

        if (content.pubPeriod?.includes(weekdayKor))
          updateDays.push(Weekday[weekdayKor]);
      });

      queue -= 1;

      const id = `kakopage_${seriesId}`;

      return {
        id,
        provider: 'KAKAO_PAGE',
        title: content.title,
        url: `https://page.kakao.com/content/${seriesId}`,
        updateDays,
        thumbnail: [`https:${content.thumbnail}`],
        isUpdated: webtoon.statusBadge === 'BadgeUpStatic',
        ageGrade: {
          Nineteen: 19,
          Fifteen: 15,
          All: 0,
        }[content.ageGrade],
        freeWaitHour:
          content.bm === 'PayWaitfree'
            ? content.waitfreePeriodByMinute / 60
            : null,
        isEnd: content.onIssue === 'End',
        isFree: content.bm !== 'Pay',
        authors: content.authors.split(','),
      };
    }),
  );
};
