"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAPI_1 = require("../../modules/getAPI");
var commonData_1 = require("../../modules/commonData");
//다음 웹툰
var get_daum_webtoon_json = function (fragments, type) {
    return getAPI_1.getJsonAPI("http://webtoon.daum.net/data/pc/webtoon/list_" + fragments + "/" + type).data;
};
var reconstruct_webtoon_data = function (json, week_num) {
    return json.map(function (data) {
        var state_variable = data.restYn;
        var state_value = week_num == 7
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
};
var get_finished_webtoon = function () {
    var free_data = get_daum_webtoon_json("finished", "free");
    var pay_data = get_daum_webtoon_json("finished", "pay");
    var original_data = free_data.concat(pay_data);
    return reconstruct_webtoon_data(original_data, 7);
};
var get_weekly_webtoon = function () {
    var result = [];
    for (var week_num = 0; week_num < 7; week_num++) {
        var original_data = get_daum_webtoon_json("serialized", commonData_1.weekday[week_num]);
        var reconstructed_data = reconstruct_webtoon_data(original_data, week_num);
        result = result.concat(reconstructed_data);
    }
    return result;
};
var get_daum_webtoon = function () {
    return get_finished_webtoon().concat(get_weekly_webtoon());
};
exports.default = get_daum_webtoon;
