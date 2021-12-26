import axios from 'axios';
import { uniqBy } from 'lodash';

interface KakaoWebtoon {
  content: {
    title: string;
    id: number;
    seoId: string;
    authors: { name: string; type: 'AUTHOR' | 'ILLUSTRATOR'; order: number }[];
    featuredCharacterImageA: string;
  };
  additional: WebtoonObject.Additional;
}

/**kakao Webtoon 기존 API의 정보를 조합해 표준화된 정보로 변환
 * @param webtoon_data_arr kakao webtoon API 정보 배열
 * @param week_num 웹툰의 요일(0~6) / 완결(7)
 * @returns 표준 웹툰 정보 배열
 * */
function classifyWebtoon(
  webtoon_data_arr: KakaoWebtoon[],
  week_num: number,
): WebtoonObject.CrawlerOutput[] {
  const KAKAO_WEBTOON_URL = 'https://webtoon.kakao.com/content/';
  return webtoon_data_arr.map((webtoonData) => {
    const { content, additional } = webtoonData;
    const authors = uniqBy(content.authors, 'name');
    const author_illustrator = authors.filter(
      (author) => author.type === 'AUTHOR' || author.type === 'ILLUSTRATOR',
    );
    const authors_name = author_illustrator.map((author) => author.name);
    return {
      title: content.title,
      author: authors_name.join(','),
      url: `${KAKAO_WEBTOON_URL + content.seoId}/${content.id}`,
      img: `${content.featuredCharacterImageA}.png`,
      service: 'kakao',
      week: week_num,
      additional: {
        new: additional.new,
        rest: additional.rest,
        up: additional.up,
        adult: additional.adult,
      },
    };
  });
}

const API_URL = 'https://gateway-kw.kakao.com/section/v1/';
async function getWeekWebtoon(
  original: 'general' | 'novel',
): Promise<WebtoonObject.CrawlerOutput[][]> {
  const { data }: any = await axios.get(`${API_URL}pages/${original}-weekdays`);
  return data.data.sections.map((sections, weeknum: number) =>
    classifyWebtoon(sections.cardGroups[0].cards, weeknum),
  );
}

async function getFinishedWebtoon(
  placement: 'channel' | 'novel',
): Promise<WebtoonObject.CrawlerOutput[]> {
  const { data }: any = await axios.get(
    `${API_URL}sections?placement=${placement}_completed`,
  );
  return classifyWebtoon(data.data[0].cardGroups[0].cards, 7);
}

export default async function kakaoCrawler() {
  console.log('kakao crawler start');
  const result: WebtoonObject.CrawlerOutput[] = [];
  const general_week_webtoon = await getWeekWebtoon('general');
  const novel_week_webtoon = await getWeekWebtoon('novel');
  const general_finished_webtoon = await getFinishedWebtoon('channel');
  const novel_finished_webtoon = await getFinishedWebtoon('novel');
  general_week_webtoon.forEach((weekWebtoon) => {
    result.push(...weekWebtoon);
  });
  novel_week_webtoon.forEach((weekWebtoon) => {
    result.push(...weekWebtoon);
  });
  result.push(...general_finished_webtoon);
  result.push(...novel_finished_webtoon);
  console.log('kakao crawler end');
  return result;
}
