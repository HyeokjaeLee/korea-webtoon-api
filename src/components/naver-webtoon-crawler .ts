import { weekday } from "../data/weekday";
import type { Webtoon } from "../type/type.webtoon";
const request = require("request-promise-native");
import { load } from "cheerio";
const naver_webtoon_url = "https://m.comic.naver.com";

const get_a_page_webtoon = async (
  type: string,
  query_type: string,
  week_num: number
) => {
  const a_page_webtoon_info: Webtoon[] = [];
  await request(
    `${naver_webtoon_url}/webtoon/${type}.nhn?${query_type}`,
    (err: any, response: any, body: any) => {
      const $ = load(body);
      const list_selector = $("#ct > div.section_list_toon > ul > li > a");
      list_selector.map((index, element) => {
        const state_type = $(element)
          .find("div.info > span.detail > span > span")
          .eq(0)
          .text();
        const state =
          state_type == "휴재"
            ? "휴재"
            : state_type == "up"
            ? "UP"
            : type == "finish"
            ? "완결"
            : "";
        a_page_webtoon_info.push({
          title: $(element).find(".title").text(),
          artist: $(element).find(".author").text(),
          url: naver_webtoon_url + $(element).attr("href"),
          img: $(element).find("div.thumbnail > img").attr("src"),
          service: "naver",
          state: state,
          weekday: week_num,
        });
      });
    }
  );
  return a_page_webtoon_info;
};

const get_page_count = (): Promise<number> => {
  return new Promise(function (resolve, reject) {
    request(
      naver_webtoon_url + "/webtoon/finish.nhn?page=1",
      (err: any, response: any, body: any) => {
        let $ = load(body);
        resolve(
          Number(
            $(
              "#ct > div.section_list_toon > div.paging_type2 > em > span"
            ).text()
          )
        );
      }
    );
  });
};

const get_finish_webtoon = async (): Promise<Webtoon[]> => {
  const page_count = await get_page_count();
  let webtoon_arr: Webtoon[] = [];
  for (let page_index = 1; page_index < page_count; page_index++) {
    webtoon_arr = webtoon_arr.concat(
      await get_a_page_webtoon("finish", `page=${page_index}`, 7)
    );
  }
  return webtoon_arr;
};

const get_weekly_webtoon = async () => {
  const weeklyWebtoonArr = weekday.map((_weekday, _week_num) =>
    get_a_page_webtoon("weekday", `week=${_weekday}`, _week_num)
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
};

export const get_naver_webtoon = async () =>
  (await get_finish_webtoon()).concat(await get_weekly_webtoon());
