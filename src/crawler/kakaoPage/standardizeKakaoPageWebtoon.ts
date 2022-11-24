import type { KakaoPageWebtoon } from './requestWebtoonsByDayTabUid';
import { Webtoon, Singularity } from '../../types';

export const standardizeKakaoPageWebtoon = (
  kakaoPageWebtoon: KakaoPageWebtoon,
  author: string,
  updateDays: Webtoon['updateDays'],
): Webtoon => {
  const { badgeList, eventLog, ageGrade, subtitleList, statusBadge } =
    kakaoPageWebtoon;
  const { name, id } = eventLog.eventMeta;
  const singularityList: Singularity[] = [];

  if (badgeList.includes('BadgeRealFreeStatic')) {
    singularityList.push(Singularity.FREE);
  }

  if (badgeList.includes('BadgeWaitFreeStatic')) {
    singularityList.push(Singularity.WAIT_FREE);
  }

  if (ageGrade === 'Fifteen') {
    singularityList.push(Singularity.OVER_15);
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
    updateDays,
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
