import { getJsonAPI } from "../../modules/getAPI";
import { weekday } from "../../modules/commonData";
import type { A_webtoon_info } from "../../modules/types";

//다음 웹툰

const get_daum_webtoon_json = (fragments: string, type: string) =>
  getJsonAPI(
    `http://webtoon.daum.net/data/pc/webtoon/list_${fragments}/${type}`
  ).data;

const reconstruct_webtoon_data = (
  json: any,
  week_num: number
): A_webtoon_info[] =>
  json.map((data: any) => {
    const state_variable = data.restYn;
    const state_value: string =
      week_num == 7
        ? "완결"
        : week_num == new Date().getDay() && state_variable == "N"
        ? "UP"
        : state_variable == "Y"
        ? "휴재"
        : "";
    return {
      title: data.title,
      artist: data.cartoon.artists[0].penName,
      url: "http://m.webtoon.daum.net/m/webtoon/view/" + data.nickname,
      img: data.thumbnailImage2.url,
      service: "daum",
      state: state_value,
      weekday: week_num,
    };
  });

const get_finished_webtoon = () => {
  const free_data = get_daum_webtoon_json("finished", "free");
  const pay_data = get_daum_webtoon_json("finished", "pay");
  const original_data = free_data.concat(pay_data);
  return reconstruct_webtoon_data(original_data, 7);
};

const get_weekly_webtoon = () => {
  let result: A_webtoon_info[] = [];
  for (let week_num = 0; week_num < 7; week_num++) {
    const original_data = get_daum_webtoon_json(
      "serialized",
      weekday[week_num]
    );
    const reconstructed_data = reconstruct_webtoon_data(
      original_data,
      week_num
    );
    result = result.concat(reconstructed_data);
  }
  return result;
};

const get_daum_webtoon = () =>
  get_finished_webtoon().concat(get_weekly_webtoon());

export default get_daum_webtoon;
