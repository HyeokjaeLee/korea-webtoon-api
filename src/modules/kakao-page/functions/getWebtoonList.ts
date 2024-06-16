import {
  getStaticLandingGenreSection,
  KakoPageStaticLandingGenreSectionItem,
} from './kakaoPageApi';

export const getWebtoonList = async () => {
  const webtoonList: KakoPageStaticLandingGenreSectionItem[] = [];

  let page = 0;
  let isEndPage = false;

  while (!isEndPage) {
    const res = await getStaticLandingGenreSection(page);

    const { isEnd, groups } = res.data.data.staticLandingGenreSection;

    const [{ items }] = groups;

    webtoonList.push(...items);

    isEndPage = isEnd;

    page++;
  }

  return webtoonList;
};
