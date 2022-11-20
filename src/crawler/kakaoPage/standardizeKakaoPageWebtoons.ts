import type { KakaoPageWebtoon } from './requestKakaoPageWebtoons';
import type { Week, Webtoon } from '../../types';

export const standardizeKakaoPageWebtoons = (
  kakaoPageWebtoon: KakaoPageWebtoon,
  author: string,
  week: Week,
): Webtoon => {
  const { badgeList, eventLog, ageGrade, subtitleList } = kakaoPageWebtoon;
  const { eventMeta } = eventLog;
  const singularity: string[] = [];
  if (badgeList.includes('BadgeRealFreeStatic')) singularity.push('free');
  if (badgeList.includes('BadgeWaitFreeStatic')) singularity.push('wait-free');
  if (ageGrade === 'Fifteen') singularity.push('over-15');
  const popularStr = subtitleList
    .find((subtitle) => subtitle.includes('만') || subtitle.includes('억'))
    .replace(',', '');

  const popular = Math.floor(
    popularStr.includes('만')
      ? Number(popularStr.replace('만', ''))
      : Number(popularStr.replace('억', '')) * 10000,
  );

  return {
    title: eventMeta.name,
    author,
    url: `https://page.kakao.com/content/${eventMeta.id}`,
    img: kakaoPageWebtoon.thumbnail,
    service: 'kakao-page',
    week,
    popular,
    additional: {
      new: false,
      rest: false,
      up: kakaoPageWebtoon.statusBadge === 'BadgeUpStatic',
      adult: kakaoPageWebtoon.ageGrade === 'Nineteen',
      singularity,
    },
  };
};
