import type { Webtoon } from '../types/webtoon';
import { load } from 'cheerio';
import * as puppeteer from 'puppeteer';
import * as request from 'request-promise-native';
import * as fs from 'fs';
const kakako_webtoon_url: string = 'https://webtoon.kakao.com';
const originalNovel = '/original-novel';
const originalWebtoon = '/original-webtoon';
const finished = '?tab=complete';
const crawler_delay = 3500;

interface UncoumnData {
  weekday: number;
  selector: string;
}

interface CommonData {
  weekday: number;
  url: string;
}

export const kakao_crawler = async () => {
  console.log(`Kakao-Webtoon crawler has started(${new Date()})`);
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const progress = {
    now: 0,
    total: 0,
  };
  const progress_log = () => {
    progress.now++;
    console.log(
      `Kakao-Webtoon 크롤링 진행도(${
        ((progress.total - progress.now + 1) * crawler_delay) / 1000
      }초 예상): ${progress.now} / ${progress.total}`,
    );
  };

  // 실행 코드
  {
    const weeklyWebtoonURLs = await get_weeklyURL(originalWebtoon);
    const weeklyNovelURLs = await get_weeklyURL(originalNovel);
    const finishedWebtoonURLs = await get_finishedURL(
      originalWebtoon + finished,
    );
    const finishedNovelURLs = await get_finishedURL(originalNovel + finished);
    const weeklyURLs = [
      ...weeklyWebtoonURLs.commonDataList,
      ...(await get_uncommonURL(
        originalWebtoon,
        weeklyWebtoonURLs.uncommonDataList,
      )),
      ...weeklyNovelURLs.commonDataList,
      ...(await get_uncommonURL(
        originalNovel,
        weeklyNovelURLs.uncommonDataList,
      )),
    ];
    browser.close();
    const finishedURLs = [...finishedWebtoonURLs, ...finishedNovelURLs];
    progress.total = weeklyURLs.length + finishedURLs.length;
    console.log('Kakao-Webtoon URL 크롤링 완료');
    const weeklyWebtoonData = await Promise.all(
      weeklyURLs.map(
        async (weeklyURL, index) =>
          await get_a_webtoonData(weeklyURL.url, weeklyURL.weekday, index),
      ),
    );
    const finishedWebtoonData = await Promise.all(
      finishedURLs.map(
        async (finishedURL, index) =>
          await get_a_webtoonData(kakako_webtoon_url + finishedURL, 7, index),
      ),
    );
    console.log('Kakao-Webtoon 정보 크롤링 완료');
    fs.writeFileSync(
      'data/kakao-weekly-webtoon.json',
      JSON.stringify(weeklyWebtoonData),
    );
    fs.writeFileSync(
      'data/kakao-finished-webtoon.json',
      JSON.stringify(finishedWebtoonData),
    );
    console.log('Kakao-Webtoon 정보 저장 완료');
    return {
      weeklyWebtoonData,
      finishedWebtoonData,
    };
  }

  //함수 선언 부분

  function get_a_webtoonData(
    url: string,
    weekday: number,
    index: number,
  ): Promise<Webtoon> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        progress_log();
        request(encodeURI(url), (err, response, body) => {
          const $ = load(body);
          let artist: string | undefined = $(
            '#root > main > div > div.page.color_bg_black__2MXm7.activePage > div > div.Content_homeWrapper__2CMgX.common_positionRelative__2kMrZ > div.Content_metaWrapper__3srNJ > div.Content_contentMainWrapper__3AlhK.Content_current__2yPD8 > div.spacing_pb_28__VqvVT.spacing_pt_96__184F4 > div.common_positionRelative__2kMrZ.spacing_mx_a__2yxXH.spacing_my_0__1f7t6.MaxWidth_maxWidth__2Qvbl > div.Meta_meta__1HmBY.spacing_mx_20__17RDr.spacing_pt_16__zSxeh > div > p.Text_default__HZL19.textVariant_s13_regular_white__1-AxN.SingleText_singleText__3htPa.spacing_mt_minus_3__3ZjH1.opacity_opacity85__gH87s.lineHeight_lh_21__1MiQ7.Meta_author__1VKLY',
          ).text();
          const get_metaData = (name: string) =>
            $(`head > meta[name=${name}]`).attr('content');
          let title = get_metaData('og:title');
          let adult = false;
          if (!title || !artist) {
            const metaData = get_metaData('keywords')?.split(', ');
            title = metaData?.[0];
            artist = metaData?.slice(1, -1)?.join(', ');
            adult = true;
          }
          const webtoonData = {
            title: title,
            artist: artist,
            url: encodeURI(url),
            img: get_metaData('og:image'),
            service: 'kakao',
            weekday: weekday,
            adult: adult,
          };
          console.log(webtoonData);
          resolve(webtoonData);
        });
      }, index * crawler_delay);
    });
  }

  async function get_finishedURL(endpoint: string) {
    const page = await browser.newPage();
    await page.goto(kakako_webtoon_url + endpoint);
    await page.waitForSelector('.ParallaxItem_layerFront__3diPa');
    let i = 1;
    const selector = (index: number) =>
      `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div.ParallaxContainer_parallaxContainer__1nXb9.ParallaxContainer_vertical__3CiC8.swiper-scroll-perf > div > div.common_widthFull__1hw6a.common_heightFull__3OHiU.common_positionRelative__2kMrZ > div.spacing_mx_minus_1__17S2G.CompleteContentTable_completeCardList__eVAA- > div:nth-child(${i})`;
    try {
      while (true) {
        await page.waitForSelector(selector(i), {
          timeout: 1000,
        });
        await page.click(selector(i), {
          button: 'right',
        });

        i++;
      }
    } catch (e) {
      const $ = load(await page.content());
      const urlList = $.html().match(/\/content.{1,20}\/\d+/g);
      page.close();
      return urlList as string[];
    }
  }

  async function get_weeklyURL(endpoint: string) {
    const page = await browser.newPage();
    await page.goto(kakako_webtoon_url + endpoint);
    await page.waitForSelector('.Masonry_masonry__38RyV');
    const $ = load(await page.content());
    const commonDataList: CommonData[] = [];
    const uncommonDataList: UncoumnData[] = [];
    const webtoon_container_by_index = (index: number) =>
      `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div > div > div > div:nth-child(${index}) > div.Masonry_masonry__38RyV > div`;
    for (let weekIndex = 0; weekIndex <= 6; weekIndex++) {
      const webtoonContainerSelector = webtoon_container_by_index(
        weekIndex + 1,
      );
      const webtoonContainer = $(webtoonContainerSelector);
      webtoonContainer.each((index, element) => {
        const crawled_url = $(element)
          .find('div > div > div > div > a')
          .attr('href');
        if (!!crawled_url) {
          crawled_url === '#none'
            ? uncommonDataList.push({
                weekday: weekIndex,
                selector: `${webtoonContainerSelector}:nth-child(${
                  index + 1
                }) > div > div > div`,
              })
            : commonDataList.push({
                weekday: weekIndex,
                url: kakako_webtoon_url + crawled_url,
              });
        }
      });
    }
    return {
      commonDataList,
      uncommonDataList,
    };
  }

  async function get_uncommonURL(
    endpoint: string,
    uncommonDataList: UncoumnData[],
  ) {
    const get_a_uncommonURL = async (selector: string) => {
      const page = await browser.newPage();
      await page.goto(kakako_webtoon_url + endpoint);
      await page.waitForSelector(selector);
      try {
        //한번에 클릭이 안되는 경우가 있음
        while (true) {
          await page.click(selector);
        }
      } catch (e) {
        const url = page.url();
        await page.close();
        return url;
      }
    };
    const uncommonURL: Promise<CommonData>[] = uncommonDataList.map(
      async (uncommonData, index) => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            resolve({
              weekday: uncommonData.weekday,
              url: await get_a_uncommonURL(uncommonData.selector),
            });
          }, index * crawler_delay);
        });
      },
    );
    return await Promise.all(uncommonURL);
  }
};
