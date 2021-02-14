const request = require("request-promise-native");
import { weekday } from "./weekday";
import type { A_webtoon_info } from "./types";
import { load } from "cheerio";

//네이버 웹툰
const get_naver_webtoon = async (): Promise<object[]> => {
  let naver_webtoon_info: object[] = [];
  const naver_comic_url = "https://m.comic.naver.com";
  enum Sortation {
    weekday,
    finished,
  }

  const naver_url_package = (sortation: Sortation, num: number) => {
    let target_url: string;
    switch (sortation) {
      case Sortation.weekday:
        target_url = naver_comic_url + "/webtoon/weekday.nhn?week=" + weekday[num];
        break;
      case Sortation.finished:
        target_url = naver_comic_url + "/webtoon/finish.nhn?page=" + num;
        break;
    }
    return target_url;
  };

  const get_page_count = () => {
    return new Promise(function (resolve, reject) {
      request(naver_url_package(Sortation.finished, 1), (err: any, response: any, body: any) => {
        let $: any = load(body);
        resolve($(".paging_type2").find(".current_pg").find(".total").text());
      });
    });
  };

  const get_naver_finished_webtoon = async () => {
    let a_naver_webtoon_info: object;
    const page_count = Number(await get_page_count());
    for (let i = 1; i <= page_count; i++) {
      await request(naver_url_package(Sortation.finished, i), (err: any, response: any, body: any) => {
        let $: any = load(body);
        let page_webtoon_count = $(".list_toon.list_finish").find(".item").find(".info").length;
        for (let webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
          a_naver_webtoon_info = get_a_naver_webtoon($, ".list_finish", webtoon_num);
          naver_webtoon_info.push(a_naver_webtoon_info);
        }
      });
    }
  };

  const get_naver_weekday_webtoon = async () => {
    let a_naver_webtoon_info: object;
    for (let week_num: number = 0; week_num < 7; week_num++) {
      await request(naver_url_package(Sortation.weekday, week_num), (err: any, response: any, body: any) => {
        let $: any = load(body);
        let page_webtoon_count = $(".list_toon").find(".item").find(".info").length;
        for (let webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
          a_naver_webtoon_info = get_a_naver_webtoon($, "", webtoon_num, week_num);
          naver_webtoon_info.push(a_naver_webtoon_info);
        }
      });
    }
  };

  const get_a_naver_webtoon = ($: any, index: string, webtoon_num: number, week_num?: number): A_webtoon_info => {
    let state_value: string;
    let weekday_value: number;
    if (index == "") {
      const state_variable_calc: string = $(".list_toon").find(".info").eq(webtoon_num).find(".detail").find(".blind").eq(0).text();
      switch (state_variable_calc) {
        case "휴재":
          state_value = "휴재";
          break;
        case "up":
          state_value = "UP";
          break;
        default:
          state_value = "";
          break;
      }
      if (week_num != undefined) {
        weekday_value = week_num;
      } else {
        weekday_value = 7;
      }
    } else {
      state_value = "완결";
      weekday_value = 7;
    }

    return {
      title: $(".list_toon" + index)
        .find(".info")
        .eq(webtoon_num)
        .find(".title")
        .text(),
      artist: $(".list_toon" + index)
        .find(".info")
        .eq(webtoon_num)
        .find(".author")
        .text(),
      url:
        naver_comic_url +
        $(".list_toon" + index)
          .find("a")
          .eq(webtoon_num)
          .attr("href"),
      img: $(".list_toon" + index)
        .find(".thumbnail")
        .eq(webtoon_num)
        .find("img")
        .attr("src"),
      service: "Naver",
      state: state_value,
      weekday: weekday_value,
    };
  };

  await get_naver_weekday_webtoon();
  await get_naver_finished_webtoon();
  return naver_webtoon_info;
};

export default get_naver_webtoon;
