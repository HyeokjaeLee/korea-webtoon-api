import type { KakaoPageWebtoon } from './requestWebtoonsByDayTabUid';
import type { Webtoon, Singularity } from '../../types';

export const standardizeKakaoPageWebtoons = (
  kakaoPageWebtoon: KakaoPageWebtoon,
  author: string,
  week: number,
): Webtoon => {
  const { badgeList, eventLog, ageGrade, subtitleList, statusBadge } =
    kakaoPageWebtoon;
  const { name, id } = eventLog.eventMeta;
  const singularityList: Singularity[] = [];

  if (badgeList.includes('BadgeRealFreeStatic')) {
    singularityList.push('free');
  }

  if (badgeList.includes('BadgeWaitFreeStatic')) {
    singularityList.push('wait-free');
  }

  if (ageGrade === 'Fifteen') {
    singularityList.push('over-15');
  }

  const fanCountText = subtitleList
    .find((subtitle) => subtitle.includes('만') || subtitle.includes('억'))
    ?.replace(',', '');

  const fanCount = fanCountText
    ? Math.floor(
        fanCountText?.includes('만')
          ? Number(fanCountText?.replace('만', ''))
          : Number(fanCountText?.replace('억', '')) * 10000,
      )
    : null;

  return {
    title: name,
    author,
    url: `https://page.kakao.com/content/${id}`,
    img: kakaoPageWebtoon.thumbnail,
    service: 'kakao-page',
    week,
    fanCount,
    additional: {
      new: statusBadge === 'BadgeNewStatic',
      rest: false,
      up: statusBadge === 'BadgeUpStatic',
      adult: kakaoPageWebtoon.ageGrade === 'Nineteen',
      singularityList,
    },
  };
};
