import type { Webtoon, Additional } from '../types/webtoon';
import * as fs from 'fs';
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
    weekday + 1
  }`;
  const { data }: any = await axios.get(kakaoPageURL);
  const webtoonDataArr: KakaoPageWebtoon[] = data.list;
  if (webtoonDataArr.length !== 0) {
    return webtoonDataArr.map((webtoonData) => ({
      title: webtoonData.title,
      author: webtoonData.author,
      img: `http://dn-img-page.kakao.com/download/resource?kid=${webtoonData.image}&filename=th2`,
      service: 'kakao-page',
      weekday: weekday === 12 ? 7 : weekday,
      additional: {
        new: false,
        rest: false, //휴재중인 웹툰이 없어서 확인 불가
        up: false,
        adult: false, //kakao page는 성인 웹툰 서비스X
      },
    }));
  } else {
    return false;
  }
}
(async () => {
  console.log(await get_webtoonData(20, 1));
})();

//화요일 웹툰 엑스텐 확인후 UP, NEW 동시 Badge 추가
('BT03 new');
('BT02 UP');
