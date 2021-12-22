import axios from 'axios';

interface KakaoPageWebtoon {
  title: string;
  image: string;
  badge: string;
  author: string;
  series_id: number;
}

async function getWebtoons(
  page: number,
  week: number,
): Promise<WebtoonObject.CrawlerOutput[] | false> {
  const KAKAO_PAGE_URL = `https://api2-page.kakao.com/api/v2/store/day_of_week_top/list?category=10&subcategory=0&page=${page}&day=${
    week === 7 ? 12 : week + 1
  }`;
  const { data }: any = await axios.get(KAKAO_PAGE_URL);
  const webtoons: KakaoPageWebtoon[] = data.list;
  if (webtoons.length !== 0) {
    return webtoons.map((webtoon) => {
      const is_new = webtoon.badge === 'BT03';
      const is_up = webtoon.badge === 'BT02';
      return {
        title: webtoon.title,
        author: webtoon.author,
        url: `https://page.kakao.com/home?seriesId=${webtoon.series_id}`,
        img: `http://dn-img-page.kakao.com/download/resource?kid=${webtoon.image}&filename=th2`,
        service: 'kakao-page',
        week: week,
        additional: {
          new: is_new,
          rest: false, //휴재중인 웹툰이 없어서 확인 불가
          up: is_up,
          adult: false, //kakao page는 성인 웹툰 서비스X
        },
      };
    });
  } else {
    return false;
  }
}

async function getOneDayWebtoons(weeknum: number) {
  const webtoons: WebtoonObject.CrawlerOutput[] = [];
  let page = 0;
  while (true) {
    const one_page_webtoonData = await getWebtoons(page, weeknum);
    if (!one_page_webtoonData) break;
    else {
      webtoons.push(...one_page_webtoonData);
      page++;
    }
  }
  return webtoons;
}

export default async function kakaoPageCrawler() {
  console.log('kakao-page crawler start');
  const result: WebtoonObject.CrawlerOutput[] = [];
  for (let i = 0; i < 7; i++) result.push(...(await getOneDayWebtoons(i)));
  result.push(...(await getOneDayWebtoons(7)));
  console.log('kakao-page crawler end');
  return result;
}
