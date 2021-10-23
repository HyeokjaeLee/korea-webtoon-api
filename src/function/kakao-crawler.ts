import type { Webtoon, Additional } from '../types/webtoon';
import * as fs from 'fs';
import axios from 'axios';
import * as _ from 'lodash';

interface KakaoWebtoon {
  content: {
    title: string;
    id: number;
    seoId: string;
    authors: { name: string; type: 'AUTHOR' | 'ILLUSTRATOR'; order: number }[];
  };
  additional: Additional;
}

/**kakao Webtoon 기존 API의 정보를 조합해 표준화된 정보로 변환
 * @param dataArr kakao webtoon API 정보 배열
 * @param weeknum 웹툰의 요일(0~6) / 완결(7)
 * @returns 표준 웹툰 정보 배열
 * */
function classify_webtoon(dataArr: KakaoWebtoon[], weeknum: number): Webtoon[] {
  const kakao_webtoon_url = 'https://webtoon.kakao.com/content/';
  return dataArr.map((data) => {
    const { content, additional } = data;
    const authors = _.uniqBy(content.authors, 'name');
    const onlyAuthorIllustrator = authors.filter(
      (author) => author.type === 'AUTHOR' || author.type === 'ILLUSTRATOR',
    );
    const authorsName = onlyAuthorIllustrator.map((author) => author.name);
    return {
      title: content.title,
      author: authorsName.join(', '),
      url: `${kakao_webtoon_url + content.seoId}/${content.id}`,
      img: `https://kr-a.kakaopagecdn.com/P/C/${content.id}/sharing/2x/eacb00ec-9034-42cb-a533-7c7690741113.jpg`,
      service: 'kakao',
      weekday: weeknum,
      additional: {
        new: additional.new,
        rest: additional.rest,
        up: additional.up,
        adult: additional.adult,
      },
    };
  });
}

const apiURL = 'https://gateway-kw.kakao.com/section/v1/';
async function get_weekdayWebtoon(
  original: 'general' | 'novel',
): Promise<Webtoon[][]> {
  const { data }: any = await axios.get(`${apiURL}pages/${original}-weekdays`);
  return data.data.sections.map((sections, weeknum: number) =>
    classify_webtoon(sections.cardGroups[0].cards, weeknum),
  );
}

async function get_finishedWebtoon(
  placement: 'channel' | 'novel',
): Promise<Webtoon[]> {
  const { data }: any = await axios.get(
    `${apiURL}sections?placement=${placement}_completed`,
  );
  return classify_webtoon(data.data[0].cardGroups[0].cards, 7);
}

export default async function kakao_crawler() {
  console.log(`kakao crawler start (${new Date()})`);
  const generalWeekdayWebtoon = await get_weekdayWebtoon('general');
  const novelWeekdayWebtoon = await get_weekdayWebtoon('novel');
  const generalFinishedWebtoon = await get_finishedWebtoon('channel');
  const novelFinishedWebtoon = await get_finishedWebtoon('novel');
  const weekdayWebtoon = generalWeekdayWebtoon.map((generalWebtoon, weeknum) =>
    generalWebtoon.concat(novelWeekdayWebtoon[weeknum]),
  );
  fs.writeFileSync(
    'data/kakao-weekday-webtoon.json',
    JSON.stringify(weekdayWebtoon),
  );
  const finishedWebtoon = generalFinishedWebtoon.concat(novelFinishedWebtoon);
  fs.writeFileSync(
    'data/kakao-finished-webtoon.json',
    JSON.stringify(finishedWebtoon),
  );
  console.log(`kakao crawler end (${new Date()}`);
  return { weekdayWebtoon, finishedWebtoon };
}
