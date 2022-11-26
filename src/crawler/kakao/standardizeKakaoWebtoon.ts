import type { KakaoWebtoon } from './requestKakaoWebtoons';
import { Webtoon, Singularity, ServiceCode, Service } from '../../types';
import { standardizeChars } from 'utils';

const KAKAO_WEBTOON_URL = 'https://webtoon.kakao.com/content';

export const standardizeKakaoWebtoon = (
  KakaoWebtoon: KakaoWebtoon,
  updateDays: Webtoon['updateDays'],
  fanCount: Webtoon['fanCount'],
  singularityList: Singularity[] = [],
): Webtoon => {
  const { content, additional } = KakaoWebtoon,
    { authors, id, title } = content;

  let author = authors.find((author) => author.type === 'AUTHOR')?.name ?? '';

  const illustrator = authors.find(
    (author) => author.type === 'ILLUSTRATOR',
  )?.name;

  if (illustrator && illustrator !== author) author += `,${illustrator}`;

  singularityList = [...singularityList];

  if (content.ageLimit === 15) singularityList.push(Singularity.OVER_15);

  return {
    webtoonId: ServiceCode.KAKAO + Number(id),
    title: title,
    author,
    url: `${KAKAO_WEBTOON_URL}/${content.seoId}/${id}`,
    img: `${content.featuredCharacterImageA}.png`,
    service: Service.KAKAO,
    updateDays,
    fanCount,
    searchKeyword: standardizeChars(title + author),
    additional: {
      new: additional.new,
      rest: additional.rest,
      up: additional.up,
      adult: content.ageLimit > 18,
      singularityList,
    },
  };
};
