import { getWebtoonList } from './function/getWebtoonList';
import { getContentHomeOverview } from './function/kakaoPageApi';

export const getKakaoPageWebtoonList = async () => {
  const webtoonList = await getWebtoonList();

  const normalizedWebtoonList: NormalizedWebtoon[] = [];

  //! 병렬로 요청 시 요청 제한이 걸림
  for (const webtoon of webtoonList) {
    const { content } = (await getContentHomeOverview(webtoon.seriesId)).data
      .data.contentHomeOverview;

    const updateWeek = (
      ['월', '화', '수', '목', '금', '토', '일'] as const
    ).filter((day) => {
      return content.pubPeriod?.includes(day);
    });

    normalizedWebtoonList.push({
      id: `kakopage_${webtoon.seriesId}`,
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
      authors: content.authors,
    });
  }
};
