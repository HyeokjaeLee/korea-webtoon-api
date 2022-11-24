import { crawlNaverWebtoons } from './crawlNaverWebtoons';
import { getHtmlData } from './getHtmlData';
import { NAVER_WEBTOON_URL } from '.';
import { UpdateDay, Webtoon } from '../../types';

export const crawlFinishedNaverWebtoons = async () => {
  const $ = await getHtmlData(NAVER_WEBTOON_URL + '/webtoon/finish.nhn?page=1');
  const pageCount = Number(
    $('#ct > div.section_list_toon > div.paging_type2 > em > span').text(),
  );

  const pageList = Array.from({ length: pageCount }, (_, i) => i + 1);

  const finishedWebtoons: Webtoon[] = [];

  //* 각 페이지를 비동기적으로 크롤링
  await Promise.all(
    pageList.map(async (page) => {
      const webtoonsOfPage = await crawlNaverWebtoons(
        'finish',
        `page=${page}`,
        [UpdateDay.FINISHED],
      );
      finishedWebtoons.push(...webtoonsOfPage);
    }),
  );

  return finishedWebtoons;
};

crawlFinishedNaverWebtoons();
