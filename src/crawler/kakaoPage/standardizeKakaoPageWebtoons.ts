import type { KakaoPageWebtoon } from './requestKakaoPageWebtoons';
import type { Week, Webtoon, Singularity } from '../../types';

export const standardizeKakaoPageWebtoons = (
  kakaoPageWebtoon: KakaoPageWebtoon,
  author: string,
  week: Week,
): Webtoon => {
  const { badgeList, eventLog, ageGrade, subtitleList } = kakaoPageWebtoon;
  const { eventMeta } = eventLog;
  const singularity: Singularity[] = [];
  if (badgeList.includes('BadgeRealFreeStatic')) singularity.push('free');
  if (badgeList.includes('BadgeWaitFreeStatic')) singularity.push('wait-free');
  if (ageGrade === 'Fifteen') singularity.push('over-15');

  const calcPopular = (): number | null => {
    try {
      const popularStr = subtitleList
        .find((subtitle) => subtitle.includes('만') || subtitle.includes('억'))
        .replace(',', '');

      return Math.floor(
        popularStr.includes('만')
          ? Number(popularStr.replace('만', ''))
          : Number(popularStr.replace('억', '')) * 10000,
      );
    } catch {
      return null;
    }
  };

  return {
    title: eventMeta.name,
    author,
    url: `https://page.kakao.com/content/${eventMeta.id}`,
    img: kakaoPageWebtoon.thumbnail,
    service: 'kakao-page',
    week,
    popular: calcPopular(),
    additional: {
      new: false,
      rest: false,
      up: kakaoPageWebtoon.statusBadge === 'BadgeUpStatic',
      adult: kakaoPageWebtoon.ageGrade === 'Nineteen',
      singularity,
    },
  };
};
