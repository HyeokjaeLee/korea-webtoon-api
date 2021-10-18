import { weekday } from "../data/base-data";
import type { Webtoon } from "../types/webtoon";
import { load } from "cheerio";
import puppeteer from "puppeteer";
import request from "request-promise-native";
import { getName } from "domutils";
const kakako_webtoon_url = "https://webtoon.kakao.com/";

const original_webtoon_url = kakako_webtoon_url + "original-webtoon";

async function get_url_list(endpoint: string) {
  const get_content = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://webtoon.kakao.com/${endpoint}`);
    await page.waitForSelector(".Masonry_masonry__38RyV");
    const content = await page.content();
    await browser.close();
    return content;
  };
  const $ = load(await get_content());
  const webtoon_container_by_index = (index: number) =>
    `#root > main > div > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-pointer-events > div > div.swiper-slide.swiper-slide-active > div > div > div > div > div > div:nth-child(${index}) > div.Masonry_masonry__38RyV > div`;

  for (let i = 1; i <= 7; i++) {
    console.log(i);
    const webtoon_container_selector = webtoon_container_by_index(i);
    const webtoon_container = $(webtoon_container_selector);
    const get_uncommon_url = async (index: number) => {
      const selector = `${webtoon_container_selector}:nth-child(${index + 1}) > div > div > div`;
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(`https://webtoon.kakao.com/${endpoint}`);
      await page.waitForSelector(selector);
      try {
        while (true) {
          await page.click(selector);
        }
      } catch (e) {
        page.close();
        return page.url();
      }
    };

    const url_list: any = [];
    webtoon_container.each((index, element) => {
      let url = $(element).find("div > div > div > div > a").attr("href");
      if (url === "#none") {
        url_list.push(get_uncommon_url(index));
      } else {
        url_list.push(url);
      }
    });
    Promise.all(url_list).then((url_list) => {
      console.log(url_list);
    });
  }
}

const main = async () => {
  await get_url_list("original-webtoon");
};
main();

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
 */
