import { parentPort } from "worker_threads";
import * as request from "request-promise-native";
import { load } from "cheerio";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
interface A_webtoon_info {
  title: string;
  artist: string;
  url: string;
  img: string;
  service: string;
  state: string;
  weekday: number;
}
const weekday: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

//--------------------------------------------------------------------------------
//main 실행 함수
const main = async () => {
  const naver_info: object[] = await get_naver_webtoon();
  const daum_info: object[] = await get_daum_webtoon();
  let webtoon_info: object[] = naver_info.concat(daum_info);
  console.log("Data update was successful (" + new Date() + ")");
  parentPort.postMessage(webtoon_info);
  parentPort.close();
};
//--------------------------------------------------------------------------------

const get_json_data = (url: string) => {
  let xmlhttp = new XMLHttpRequest();
  let json_data: string = "";
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        json_data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
    }
  };
  xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
  xmlhttp.send();
  return json_data;
};

//다음 웹툰
const get_daum_webtoon = (): object[] => {
  let daum_webtoon_info: object[] = [];
  let weekday_value: number;
  let state_value: string;
  let a_daum_webtoon_info: object;

  const daum_json_url = (platform: string): string => {
    let target_url: string =
      "http://webtoon.daum.net/data/" + platform + "/webtoon";
    return target_url;
  };

  const daum_url_package = (i: number): string => {
    let target_url: string;
    let fragments_url: string[] = ["/list_serialized/", "/list_finished/"];
    switch (i) {
      case 7:
        target_url = daum_json_url("pc") + fragments_url[1] + "free";
        break;
      case 8:
        target_url = daum_json_url("pc") + fragments_url[1] + "pay";
        break;
      default:
        target_url = daum_json_url("pc") + fragments_url[0] + weekday[i];
        break;
    }
    return target_url;
  };

  for (var i = 0; i < 9; i++) {
    let data: any = get_json_data(daum_url_package(i));
    let get_a_daum_webtoon_info = (k: number, i: number): A_webtoon_info => {
      var state_variable = data.data[k].restYn;
      if (i > 6) {
        weekday_value = 7;
      } else {
        weekday_value = i;
      }
      if (new Date().getDay() == weekday_value && state_variable == "N") {
        state_value = "UP";
      } else if (state_variable == "Y") {
        state_value = "휴재";
      } else {
        state_value = "";
      }

      return {
        title: data.data[k].title,
        artist: data.data[k].cartoon.artists[0].penName,
        url: daum_json_url("m") + data.data[k].nickname,
        img: data.data[k].thumbnailImage2.url,
        service: "Daum", //다음
        state: state_value,
        weekday: weekday_value,
      };
    };
    for (var k = 0; k < data.data.length; k++) {
      a_daum_webtoon_info = get_a_daum_webtoon_info(k, i);
      daum_webtoon_info.push(a_daum_webtoon_info);
    }
  }
  return daum_webtoon_info;
};

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
        target_url =
          naver_comic_url + "/webtoon/weekday.nhn?week=" + weekday[num];
        break;
      case Sortation.finished:
        target_url = naver_comic_url + "/webtoon/finish.nhn?page=" + num;
        break;
    }
    return target_url;
  };

  const get_page_count = () => {
    return new Promise(function (resolve, reject) {
      request(
        naver_url_package(Sortation.finished, 1),
        (err: any, response: any, body: any) => {
          let $: any = load(body);
          resolve($(".paging_type2").find(".current_pg").find(".total").text());
        },
      );
    });
  };

  const get_naver_finished_webtoon = async () => {
    let a_naver_webtoon_info: object;
    const page_count = Number(await get_page_count());
    for (let i = 1; i <= page_count; i++) {
      await request(
        naver_url_package(Sortation.finished, i),
        (err: any, response: any, body: any) => {
          let $: any = load(body);
          let page_webtoon_count = $(".list_toon.list_finish")
            .find(".item")
            .find(".info").length;
          for (
            let webtoon_num = 0;
            webtoon_num < page_webtoon_count;
            webtoon_num++
          ) {
            a_naver_webtoon_info = get_a_naver_webtoon(
              $,
              ".list_finish",
              webtoon_num,
            );
            naver_webtoon_info.push(a_naver_webtoon_info);
          }
        },
      );
    }
  };

  const get_naver_weekday_webtoon = async () => {
    let a_naver_webtoon_info: object;
    for (let week_num: number = 0; week_num < 7; week_num++) {
      await request(
        naver_url_package(Sortation.weekday, week_num),
        (err: any, response: any, body: any) => {
          let $: any = load(body);
          let page_webtoon_count = $(".list_toon").find(".item").find(".info")
            .length;
          for (
            let webtoon_num = 0;
            webtoon_num < page_webtoon_count;
            webtoon_num++
          ) {
            a_naver_webtoon_info = get_a_naver_webtoon(
              $,
              "",
              webtoon_num,
              week_num,
            );
            naver_webtoon_info.push(a_naver_webtoon_info);
          }
        },
      );
    }
  };

  const get_a_naver_webtoon = (
    $: any,
    index: string,
    webtoon_num: number,
    week_num?: number,
  ): A_webtoon_info => {
    let get_title = $(".list_toon" + index)
      .find(".info")
      .eq(webtoon_num)
      .find(".title")
      .text();
    let get_artist = $(".list_toon" + index)
      .find(".info")
      .eq(webtoon_num)
      .find(".author")
      .text();
    let get_url =
      naver_comic_url +
      $(".list_toon" + index)
        .find("a")
        .eq(webtoon_num)
        .attr("href");
    let get_img = $(".list_toon" + index)
      .find(".thumbnail")
      .eq(webtoon_num)
      .find("img")
      .attr("src");
    let state_value: string;
    let weekday_value: number;
    if (index == "") {
      let state_variable_calc: string = $(".list_toon")
        .find(".info")
        .eq(webtoon_num)
        .find(".detail")
        .find(".blind")
        .eq(0)
        .text();
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

      weekday_value = week_num;
    } else {
      state_value = "완결";
      weekday_value = 7;
    }

    return {
      title: get_title,
      artist: get_artist,
      url: get_url,
      img: get_img,
      service: "Naver",
      state: state_value,
      weekday: weekday_value,
    };
  };

  await get_naver_weekday_webtoon();
  await get_naver_finished_webtoon();
  return naver_webtoon_info;
};

main();
