"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daumWebtoon = void 0;
var external_data_1 = require("../function/external-data");
var weekday_1 = require("../data/weekday");
var get_daum_webtoon_json = function (fragments, type) {
    return external_data_1.getJsonAPI("http://webtoon.daum.net/data/pc/webtoon/list_" + fragments + "/" + type).data;
};
var reconstruct_webtoon_data = function (_json, _week_num) {
    return _json.map(function (data) {
        var state_value = _week_num == 7
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
};
var get_finished_webtoon = function () {
    var freeData = get_daum_webtoon_json("finished", "free"), payData = get_daum_webtoon_json("finished", "pay");
    var originalData = freeData.concat(payData);
    return reconstruct_webtoon_data(originalData, 7);
};
var get_weekly_webtoon = function () {
    var result = [];
    for (var week_num = 0; week_num < 7; week_num++) {
        var originalData = get_daum_webtoon_json("serialized", weekday_1.weekday[week_num]), reconstructedData = reconstruct_webtoon_data(originalData, week_num);
        result = result.concat(reconstructedData);
    }
    return result;
};
exports.daumWebtoon = get_finished_webtoon().concat(get_weekly_webtoon());
