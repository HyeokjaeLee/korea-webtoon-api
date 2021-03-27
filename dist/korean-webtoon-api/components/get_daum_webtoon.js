"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAPI_1 = require("../../modules/getAPI");
var commonData_1 = require("../../modules/commonData");
//다음 웹툰
var get_daum_webtoon = function () {
    var daum_webtoon_info = [];
    var weekday_value;
    var state_value;
    var a_daum_webtoon_info;
    var daum_json_url = function (platform) {
        var target_url = "";
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
    var daum_url_package = function (i) {
        var target_url;
        var fragments_url = ["/list_serialized/", "/list_finished/"];
        switch (i) {
            case 7:
                target_url = daum_json_url("pc") + fragments_url[1] + "free";
                break;
            case 8:
                target_url = daum_json_url("pc") + fragments_url[1] + "pay";
                break;
            default:
                target_url = daum_json_url("pc") + fragments_url[0] + commonData_1.weekday[i];
                break;
        }
        return target_url;
    };
    var _loop_1 = function () {
        var data = getAPI_1.getJsonAPI(daum_url_package(i));
        var get_a_daum_webtoon_info = function (k, i) {
            var state_variable = data.data[k].restYn;
            if (i > 6) {
                weekday_value = 7;
                state_value = "완결";
            }
            else {
                weekday_value = i;
            }
            if (new Date().getDay() == weekday_value && state_variable == "N") {
                state_value = "UP";
            }
            else if (state_variable == "Y") {
                state_value = "휴재";
            }
            else if (state_value != "완결") {
                state_value = "";
            }
            return {
                title: data.data[k].title,
                artist: data.data[k].cartoon.artists[0].penName,
                url: daum_json_url("m") + data.data[k].nickname,
                img: data.data[k].thumbnailImage2.url,
                service: "daum",
                state: state_value,
                weekday: weekday_value,
            };
        };
        for (var k = 0; k < data.data.length; k++) {
            a_daum_webtoon_info = get_a_daum_webtoon_info(k, i);
            daum_webtoon_info.push(a_daum_webtoon_info);
        }
    };
    for (var i = 0; i < 9; i++) {
        _loop_1();
    }
    return daum_webtoon_info;
};
exports.default = get_daum_webtoon;
