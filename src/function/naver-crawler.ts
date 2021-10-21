import type { Webtoon } from '../types/webtoon';
import * as request from 'request-promise-native';
import { load } from 'cheerio';
const naver_webtoon_url = 'https://m.comic.naver.com';
const weekday: string[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
import * as fs from 'fs';

export const naver_crawler = async () => {
  console.log(`Naver-Webtoon crawler has started(${new Date()})`);
  const weeklyWebtoonData = await get_weekly_webtoon();
  const finishedWebtoonData = await get_finished_webtoon();
  console.log('Naver-Webtoon 정보 크롤링 완료');
  fs.writeFileSync(
    'data/naver-weekly-webtoon.json',
    JSON.stringify(weeklyWebtoonData),
  );
  fs.writeFileSync(
    'data/naver-finished-webtoon.json',
    JSON.stringify(finishedWebtoonData),
  );
  console.log('Naver-Webtoon 정보 저장 완료');
  return { weeklyWebtoonData, finishedWebtoonData };
};

function get_page_count(): Promise<number> {
  return new Promise(function (resolve, reject) {
    request(
      naver_webtoon_url + '/webtoon/finish.nhn?page=1',
      (err: any, response: any, body: any) => {
        let $ = load(body);
        resolve(
          Number(
            $(
              '#ct > div.section_list_toon > div.paging_type2 > em > span',
            ).text(),
          ),
        );
      },
    );
  });
}

async function get_webtoon_of_one_page(
  type: string,
  query_type: string,
  week_num: number,
) {
  const a_page_webtoon_info: Webtoon[] = [];
  await request(
    `${naver_webtoon_url}/webtoon/${type}.nhn?${query_type}`,
    (err, response, body) => {
      const $ = load(body);
      const list_selector = $('#ct > div.section_list_toon > ul > li > a');
      list_selector.map((index, element) => {
        const adult =
          $(element).find('div.thumbnail > span > span').attr('class') ===
          'badge adult'
            ? true
            : false;
        a_page_webtoon_info.push({
          title: $(element).find('.title').text(),
          artist: $(element).find('.author').text(),
          url: naver_webtoon_url + $(element).attr('href'),
          img: $(element).find('div.thumbnail > img').attr('src'),
          service: 'naver',
          weekday: week_num,
          adult: adult,
        });
      });
    },
  );
  return a_page_webtoon_info;
}

async function get_finished_webtoon(): Promise<Webtoon[]> {
  const page_count = await get_page_count();
  let webtoon_arr: Webtoon[] = [];
  for (let page_index = 1; page_index < page_count; page_index++) {
    webtoon_arr = webtoon_arr.concat(
      await get_webtoon_of_one_page('finish', `page=${page_index}`, 7),
    );
  }
  return webtoon_arr;
}

async function get_weekly_webtoon() {
  const weeklyWebtoonArr = weekday.map((_weekday, _week_num) =>
    get_webtoon_of_one_page('weekday', `week=${_weekday}`, _week_num),
  );
  await Promise.all(weeklyWebtoonArr);
  const result = [
    ...(await weeklyWebtoonArr[0]),
    ...(await weeklyWebtoonArr[1]),
    ...(await weeklyWebtoonArr[2]),
    ...(await weeklyWebtoonArr[3]),
    ...(await weeklyWebtoonArr[4]),
    ...(await weeklyWebtoonArr[5]),
    ...(await weeklyWebtoonArr[6]),
  ];
  return result;
}
