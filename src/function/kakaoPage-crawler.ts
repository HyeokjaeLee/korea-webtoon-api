import type { Webtoon } from '../types/webtoon';
import axios from 'axios';
import * as _ from 'lodash';

interface KakaoPageWebtoon {
  title: string;
  image: string;
  badge: string;
  author: string;
  series_id: number;
}

async function get_webtoonData(
  page: number,
  weekday: number,
): Promise<Webtoon[] | false> {
  const kakaoPageURL = `https://api2-page.kakao.com/api/v2/store/day_of_week_top/list?category=10&subcategory=0&page=${page}&day=${
    weekday === 7 ? 12 : weekday + 1
  }`;
  const { data }: any = await axios.get(kakaoPageURL);
  const webtoonDataArr: KakaoPageWebtoon[] = data.list;
  if (webtoonDataArr.length !== 0) {
    return webtoonDataArr.map((webtoonData) => {
      const isNew = webtoonData.badge === 'BT03';
      const isUp = webtoonData.badge === 'BT02';
      return {
        title: webtoonData.title,
        author: webtoonData.author,
        url: `https://page.kakao.com/home?seriesId=${webtoonData.series_id}`,
        img: `http://dn-img-page.kakao.com/download/resource?kid=${webtoonData.image}&filename=th2`,
        service: 'kakao-page',
        weekday: weekday,
        additional: {
          new: isNew,
          rest: false, //휴재중인 웹툰이 없어서 확인 불가
          up: isUp,
          adult: false, //kakao page는 성인 웹툰 서비스X
        },
      };
    });
  } else {
    return false;
  }
}

async function get_one_DayWebtoonData(weekday: number) {
  const webtoonData: Webtoon[] = [];
  let page = 0;
  while (true) {
    const one_page_webtoonData = await get_webtoonData(page, weekday);
    if (!one_page_webtoonData) break;
    else {
      webtoonData.push(...one_page_webtoonData);
      page++;
    }
  }
  return webtoonData;
}

export default async function kakaoPage_crawler() {
  console.log(`kakao-page crawler start (${new Date()})`);
  const weekdayWebtoon = [];
  for (let i = 0; i < 7; i++) {
    weekdayWebtoon.push(await get_one_DayWebtoonData(i));
  }
  const finishedWebtoon = await get_one_DayWebtoonData(7);

  console.log(`kakao-page crawler end (${new Date()}`);
  return { weekdayWebtoon, finishedWebtoon };
}
