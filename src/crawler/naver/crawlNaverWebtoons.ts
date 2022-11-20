import { NAVER_WEBTOON_URL } from '.';
import { getHtmlData } from './getHtmlData';
import { Week, Webtoon } from '../../types';

/**한 url에 표시되는 모든 웹툰 정보를 가지고오는 함수
 * @param type 웹툰의 종류(weekday, finish)
 * @param query 웹툰의 페이지 정보(week=mon, page=1)
 * @param weeknum 웹툰의 요일(0~6) / 완결(7)
 * @returns 표준 웹툰 정보 배열
 */
export async function crawlNaverWebtoons(
  type: 'weekday' | 'finish',
  query: string,
  week: Week,
) {
  const $ = await getHtmlData(
    `${NAVER_WEBTOON_URL}/webtoon/${type}.nhn?${query}`,
  );

  const BASE_SELECTOR = '#ct > div.section_list_toon > ul > li > a';
  const base$ = $(BASE_SELECTOR);

  return base$
    .map((_, element) => {
      let isNew = false,
        isRest = false,
        isUp = false;
      const isAdult =
        $(element).find('div.thumbnail > span > span').attr('class') ===
        'badge adult'
          ? true
          : false;

      if (type === 'weekday') {
        const detail$ = $(element).find('div.info > span.detail > span');
        const detailInfo = detail$
          .map((_, element) => $(element).attr('class').replace('bullet ', ''))
          .get();
        isNew = detailInfo.includes('new');
        isRest = detailInfo.includes('break');
        isUp = detailInfo.includes('up');
      }

      const author = $(element)
        .find('.author')
        .text()
        .replaceAll(' / ', ',')
        .replaceAll('\n', '')
        .replaceAll('\t', '');

      const webtoon: Webtoon = {
        title: $(element).find('.title').text(),
        author: author,
        url: NAVER_WEBTOON_URL + $(element).attr('href'),
        img: $(element).find('div.thumbnail > img').attr('src'),
        service: 'naver',
        popular: 0,
        week,
        additional: {
          new: isNew,
          adult: isAdult,
          rest: isRest,
          up: isUp,
          singularity: [],
        },
      };

      return webtoon;
    })
    .get();
}

(async () => {
  const result = await crawlNaverWebtoons('weekday', 'week=mon', 1);
  console.log(result);
})();
