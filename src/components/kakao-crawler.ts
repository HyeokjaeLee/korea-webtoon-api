import type { Webtoon } from "../types/webtoon";
import { load } from "cheerio";
import puppeteer from "puppeteer";
import request from "request-promise-native";
import { children } from "cheerio/lib/api/traversing";
const kakako_webtoon_url: string = "https://webtoon.kakao.com";
const originalNovel = "/original-novel";
const originalWebtoon = "/original-webtoon";
const finished = "?tab=complete";

interface UncoumnData {
  weekday: number;
  selector: string;
}

interface CommonData {
  weekday: number;
  url: string;
}

export const kakao_crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const weeklyWebtoonData = await get_weeklyURL(originalWebtoon);
  const weeklyNovelData = await get_weeklyURL(originalNovel);
  const finishedWebtoon = await get_finishedURL(originalWebtoon + finished);
  const finishedNovel = await get_finishedURL(originalNovel + finished);

  const weeklyData = [
    ...weeklyWebtoonData.commonDataList,
    ...(await get_uncommonURL(originalWebtoon, weeklyWebtoonData.uncommonDataList)),
    ...weeklyNovelData.commonDataList,
    ...(await get_uncommonURL(originalNovel, weeklyNovelData.uncommonDataList)),
  ];

  const finishedData = [...finishedWebtoon, ...finishedNovel];

  console.log(weeklyData);
  console.log(finishedWebtoon);
  browser.close();
  //함수 정의
  async function get_finishedURL(endpoint: string) {
    const page = await browser.newPage();
    await page.goto(kakako_webtoon_url + endpoint);
    await page.waitForSelector(".ParallaxItem_layerFront__3diPa");
    let i = 1;
    const selector = (index: number) =>
      `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div.ParallaxContainer_parallaxContainer__1nXb9.ParallaxContainer_vertical__3CiC8.swiper-scroll-perf > div > div.common_widthFull__1hw6a.common_heightFull__3OHiU.common_positionRelative__2kMrZ > div.spacing_mx_minus_1__17S2G.CompleteContentTable_completeCardList__eVAA- > div:nth-child(${i})`;
    try {
      while (true) {
        await page.waitForSelector(selector(i), {
          timeout: 1000,
        });
        await page.click(selector(i), {
          button: "right",
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
    await page.waitForSelector(".Masonry_masonry__38RyV");
    const $ = load(await page.content());
    const commonDataList: CommonData[] = [];
    const uncommonDataList: UncoumnData[] = [];
    const webtoon_container_by_index = (index: number) =>
      `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div > div > div > div:nth-child(${index}) > div.Masonry_masonry__38RyV > div`;
    for (let weekIndex = 0; weekIndex <= 6; weekIndex++) {
      const webtoonContainerSelector = webtoon_container_by_index(weekIndex + 1);
      const webtoonContainer = $(webtoonContainerSelector);
      webtoonContainer.each((index, element) => {
        const crawled_url = $(element).find("div > div > div > div > a").attr("href");
        if (!!crawled_url) {
          crawled_url === "#none"
            ? uncommonDataList.push({
                weekday: weekIndex,
                selector: `${webtoonContainerSelector}:nth-child(${index + 1}) > div > div > div`,
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

  async function get_uncommonURL(endpoint: string, uncommonDataList: UncoumnData[]) {
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
        page.close();
        return page.url();
      }
    };
    const uncommonURL = uncommonDataList.map(async (uncommonData) => ({
      weekday: uncommonData.weekday,
      url: await get_a_uncommonURL(uncommonData.selector),
    }));
    return await Promise.all(uncommonURL);
  }
};
kakao_crawler();
/*
request(`https://webtoon.kakao.com/content/%EB%AF%B8%EC%83%9D/818`, (err, response, body) => {
  const $ = load(body);
  console.log($(`head > meta[name="og:image"]`).attr("content"));
  console.log(
    $(
      "#root > main > div > div.page.color_bg_black__2MXm7.activePage > div > div.Content_homeWrapper__2CMgX.common_positionRelative__2kMrZ > div.Content_metaWrapper__3srNJ > div.Content_contentMainWrapper__3AlhK.Content_current__2yPD8 > div.spacing_pb_28__VqvVT.spacing_pt_96__184F4 > div.common_positionRelative__2kMrZ.spacing_mx_a__2yxXH.spacing_my_0__1f7t6.MaxWidth_maxWidth__2Qvbl > div.Meta_meta__1HmBY.spacing_mx_20__17RDr.spacing_pt_16__zSxeh > div > p.Text_default__HZL19.textVariant_s13_regular_white__1-AxN.SingleText_singleText__3htPa.spacing_mt_minus_3__3ZjH1.opacity_opacity85__gH87s.lineHeight_lh_21__1MiQ7.Meta_author__1VKLY"
    ).text()
  );
  console.log($("head > title").text());
});

const get_uncommon_url = async (index: number) => {
        const selector = `${webtoonContainerSelector}:nth-child(${index + 1}) > div > div > div`;
        const page = await browser.newPage();
        await page.goto(kakako_webtoon_url + endpoint);
        await page.waitForSelector(selector);
        try {
          //한번에 클릭이 안되는 경우가 있음
          while (true) {
            await page.click(selector);
          }
        } catch (e) {
          page.close();
          return page.url();
        }
      };

 */

/**웹툰 element중 규격이 일반적이지 않은것들은 puppeteer을 이용해 크롤링*/
