import { getJsonAPI } from "../../modules/getAPI";
import { weekday } from "../../modules/commonData";
import type { A_webtoon_info } from "../../modules/types";

//다음 웹툰
const get_daum_webtoon = (): object[] => {
  let daum_webtoon_info: object[] = [];
  let weekday_value: number;
  let state_value: string;
  let a_daum_webtoon_info: object;

  const daum_json_url = (platform: string): string => {
    let target_url: string = "";
    switch (platform) {
      case "pc":
        target_url = "http://webtoon.daum.net/data/" + platform + "/webtoon";
        break;
      case "m":
        target_url = "http://" + platform + ".webtoon.daum.net/" + platform + "/webtoon/view/";
        break;
    }
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
    let data: any = getJsonAPI(daum_url_package(i));
    let get_a_daum_webtoon_info = (k: number, i: number): A_webtoon_info => {
      var state_variable = data.data[k].restYn;
      if (i > 6) {
        weekday_value = 7;
        state_value = "완결";
      } else {
        weekday_value = i;
      }
      if (new Date().getDay() == weekday_value && state_variable == "N") {
        state_value = "UP";
      } else if (state_variable == "Y") {
        state_value = "휴재";
      } else if (state_value != "완결") {
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

export default get_daum_webtoon;
