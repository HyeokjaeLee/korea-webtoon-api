import { getJsonAPI } from "../function/external-data";
import { weekday } from "../data/weekday";
import type { Webtoon } from "../type/type.webtoon";

const get_daum_webtoon_json = (fragments: string, type: string) =>
  getJsonAPI(
    `http://webtoon.daum.net/data/pc/webtoon/list_${fragments}/${type}`
  ).data;

const reconstruct_webtoon_data = (_json: any, _week_num: number): Webtoon[] =>
  _json.map((data: any) => {
    const state_value: string =
      _week_num == 7
        ? "완결"
        : _week_num == new Date().getDay() && data.restYn == "N"
        ? "UP"
        : data.restYn == "Y"
        ? "휴재"
        : "";
    return {
      title: data.title,
      artist: data.cartoon.artists[0].penName,
      url: "http://m.webtoon.daum.net/m/webtoon/view/" + data.nickname,
      img: data.thumbnailImage2.url,
      service: "daum",
      state: state_value,
      weekday: _week_num,
    };
  });

const get_finished_webtoon = () => {
  const freeData = get_daum_webtoon_json("finished", "free"),
    payData = get_daum_webtoon_json("finished", "pay");
  const originalData = freeData.concat(payData);
  return reconstruct_webtoon_data(originalData, 7);
};

const get_weekly_webtoon = () => {
  let result: Webtoon[] = [];
  for (let week_num = 0; week_num < 7; week_num++) {
    const originalData = get_daum_webtoon_json("serialized", weekday[week_num]),
      reconstructedData = reconstruct_webtoon_data(originalData, week_num);
    result = result.concat(reconstructedData);
  }
  return result;
};

export const daumWebtoon = get_finished_webtoon().concat(get_weekly_webtoon());
