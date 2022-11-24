import type { KakaoWebtoon } from './requestKakaoWebtoons';
import { Webtoon, Singularity } from '../../types';

const KAKAO_WEBTOON_URL = 'https://webtoon.kakao.com/content';

export const standardizeKakaoWebtoon = (
  KakaoWebtoon: KakaoWebtoon,
  updateDays: Webtoon['updateDays'],
  fanCount: Webtoon['fanCount'],
  singularityList: Singularity[] = [],
): Webtoon => {
  const { content, additional } = KakaoWebtoon,
    { authors } = content;

  let author = authors.find((author) => author.type === 'AUTHOR')?.name ?? '';

  const illustrator = authors.find(
    (author) => author.type === 'ILLUSTRATOR',
  )?.name;

  if (illustrator && illustrator !== author) author += `,${illustrator}`;

  singularityList = [...singularityList];

  if (content.ageLimit === 15) singularityList.push(Singularity.OVER_15);

  return {
    title: content.title,
    author,
    url: `${KAKAO_WEBTOON_URL}/${content.seoId}/${content.id}`,
    img: `${content.featuredCharacterImageA}.png`,
    service: 'kakao',
    updateDays,
    fanCount,
    additional: {
      new: additional.new,
      rest: additional.rest,
      up: additional.up,
      adult: content.ageLimit > 18,
      singularityList,
    },
  };
};
