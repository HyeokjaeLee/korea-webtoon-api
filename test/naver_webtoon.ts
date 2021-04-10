const request = require("request-promise-native");
import { load } from "cheerio";

const naver_webtoon_url = "https://m.comic.naver.com";

const get_finished_webtoon = () => {
  for (
    let page_index = 1, page_count = 1;
    page_index <= page_count;
    page_index++
  ) {}
  //const finished_webtoon_url = `${naver_webtoon_url}/webtoon/finish.nhn?page=${page_index}`
};

/*class get_a_page_webtoon{
  #ct > div.section_list_toon > ul > li:nth-child(1) > a > div.thumbnail > img
}*/


const get_a_page_webtoon = (type:string, query_type:string, query_index:number|string) => {
  return new Promise(function (resolve, reject) {
    request(
      `${naver_webtoon_url}/webtoon/${type}.nhn?${query}`,
      (err: any, response: any, body: any) => {
        const $ = load(body);
        const list_selector = $("#ct > div.section_list_toon > ul > li > a");
        const a_page_webtoon_info = list_selector.map((index, element) => {
          if(type=="finished"){

          }
          const state_type = $(element)
            .find("div.info > span.detail > span.bullet.up > span")
            .text();
          return {
            title: $(element).find(".title").text(),
            artist: $(element).find(".author").text(),
            url: naver_webtoon_url + $(element).attr("href"),
            img: $(element).find("div.thumbnail > img").attr("src"),
            service: "naver",
            state: "완결",
            weekday: 7,
          };
        });
        resolve(a_page_webtoon_info);
      }
    );
  });
};
