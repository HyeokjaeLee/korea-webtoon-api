import type { Webtoon } from '../types/webtoon';
import axios from 'axios';
import { load } from 'cheerio';

import * as fs from 'fs';
const load_$ = async (url: string) => {
  const html: { data: string } = await axios.get(url);
  return load(html.data);
};

const naver_webtoon_url = 'https://m.comic.naver.com';
/**한 url에 표시되는 모든 웹툰 정보를 가지고오는 함수
 * @param type 웹툰의 종류(weekday, finish)
 * @param query 웹툰의 페이지 정보(week=mon, page=1)
 * @param weeknum 웹툰의 요일(0~6) / 완결(7)
 * @returns 표준 웹툰 정보 배열
 */
async function get_webtoonData(
  type: 'weekday' | 'finish',
  query: string,
  weeknum: number,
): Promise<Webtoon[]> {
  const $ = await load_$(`${naver_webtoon_url}/webtoon/${type}.nhn?${query}`);
  const baseSelector = $('#ct > div.section_list_toon > ul > li > a');
  return baseSelector
    .map((index, element) => {
      const isAdult =
        $(element).find('div.thumbnail > span > span').attr('class') ===
        'badge adult'
          ? true
          : false;
      let isNew = false;
      let isRest = false;
      let isUp = false;
      if (type === 'weekday') {
        const detailSelector = $(element).find('div.info > span.detail > span');
        const detailInfo = detailSelector
          .map((index, element) =>
            $(element).attr('class').replace('bullet ', ''),
          )
          .get();
        isNew = detailInfo.includes('new');
        isRest = detailInfo.includes('break');
        isUp = detailInfo.includes('up');
      }
      return {
        title: $(element).find('.title').text(),
        author: $(element).find('.author').text(),
        url: naver_webtoon_url + $(element).attr('href'),
        img: $(element).find('div.thumbnail > img').attr('src'),
        service: 'naver',
        weekday: weeknum,
        additional: {
          new: false,
          adult: isAdult,
          rest: false,
          up: false,
        },
      };
    })
    .get();
}

async function get_weekdayWebtoon() {
  const weekdayArr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return await Promise.all(
    weekdayArr.map(
      async (weekday, weeknum) =>
        await get_webtoonData('weekday', `week=${weekday}`, weeknum),
    ),
  );
}

async function get_finishedWebtoon() {
  let finishedWebtoon = [];
  const $ = await load_$(naver_webtoon_url + '/webtoon/finish.nhn?page=1');
  const pageCount = Number(
    $('#ct > div.section_list_toon > div.paging_type2 > em > span').text(),
  );
  for (let page = 1; page < pageCount; page++) {
    finishedWebtoon.push(
      ...(await get_webtoonData('finish', `page=${page}`, 7)),
    );
  }
  return finishedWebtoon;
}

export default async function naver_crawler() {
  console.log(`naver crawler start (${new Date()})`);
  const weekdayWebtoon = await get_weekdayWebtoon();
  fs.writeFileSync(
    '../../data/naver-weekday-webtoon.json',
    JSON.stringify(weekdayWebtoon),
  );
  const finishedWebtoon = await get_finishedWebtoon();
  fs.writeFileSync(
    '../../data/naver-finished-webtoon.json',
    JSON.stringify(finishedWebtoon),
  );
  console.log(`naver crawler end (${new Date()}`);
  return { weekdayWebtoon, finishedWebtoon };
}
