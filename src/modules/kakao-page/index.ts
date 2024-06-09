import { getWebtoonList } from './function/getWebtoonList';
import { getContentHomeOverview } from './function/kakaoPageApi';

export const getKakaoPageWebtoonList = async () => {
  const webtoonList = await getWebtoonList();

  //! 요청 제한을 위한 큐, 카카오 페이지는 동시 요청 횟수 제한이 있는듯
  const LIMIT_QUEUE = 10;
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

      const updateWeek = (
        ['월', '화', '수', '목', '금', '토', '일'] as const
      ).filter((day) => content.pubPeriod?.includes(day));

      queue -= 1;

      const id = `kakopage_${seriesId}`;

      console.info(id);

      return {
        id,
        provider: 'KAKAO_PAGE',
        title: content.title,
        url: `https://page.kakao.com/content/${seriesId}`,
        updateWeek: updateWeek.length ? updateWeek : null,
        thumbnail: 'https:' + content.thumbnail,
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
