import {
  type GetStaticLandingGenreSectionResponse,
  getStaticLandingGenreSection,
  KakoPageStaticLandingGenreSectionItem,
} from './kakaoPageApi';

export const getWebtoonList = async () => {
  const webtoonList: KakoPageStaticLandingGenreSectionItem[] = [];

  let page = 0;
  let isEndPage = false;

  while (!isEndPage) {
    //! 개발환경에서 테스트를 위해 요청 횟수 제한
    if (process.env.NODE_ENV === 'development' && page > 2) break;

    const res = await getStaticLandingGenreSection(page);

    const { isEnd, groups } = res.data.data.staticLandingGenreSection;

    const [{ items }] = groups;

    webtoonList.push(...items);

    isEndPage = isEnd;

    page++;
  }

  return webtoonList;
};
