"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var request = require("request");
var cheerio_1 = require("cheerio");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var index_num;
//----------------------------------------------------------------------------------------------------------------------
var get_json_data = function (url) {
    var xmlhttp = new XMLHttpRequest();
    var json_data;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                json_data = JSON.parse(xmlhttp.responseText);
            }
            catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };
    xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
    xmlhttp.send();
    return (json_data);
};
var get_daum_webtoon = function () {
    var daum_webtoon_info = [];
    var weekday_value;
    var state_value;
    var a_daum_webtoon_info;
    var daum_json_url = "http://webtoon.daum.net/data/pc/webtoon";
    var url_package = [
        "/list_serialized/sun",
        "/list_serialized/mon",
        "/list_serialized/tue",
        "/list_serialized/wed",
        "/list_serialized/thu",
        "/list_serialized/fri",
        "/list_serialized/sat",
        "/list_finished/free",
        "/list_finished/pay",
    ];
    var _loop_1 = function () {
        var data = get_json_data(daum_json_url + url_package[i]);
        var get_a_daum_webtoon_info = function (k, i) {
            var state_variable = data.data[k].restYn;
            if (i > 6) {
                weekday_value = 7;
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
            else {
                state_value = "";
            }
            return ({
                title: data.data[k].title,
                artist: data.data[k].cartoon.artists[0].penName,
                url: "http://webtoon.daum.net/m/webtoon/view/" + data.data[k].nickname,
                img: data.data[k].thumbnailImage2.url,
                service: "Daum",
                state: state_value,
                weekday: weekday_value
            });
        };
        for (var k = 0; k < data.data.length; k++) {
            a_daum_webtoon_info = get_a_daum_webtoon_info(k, i);
            daum_webtoon_info.push(a_daum_webtoon_info);
        }
    };
    for (var i = 0; i < 9; i++) {
        _loop_1();
    }
    return (daum_webtoon_info);
};
function get_page_count() {
    return (new Promise(function (resolve, reject) {
        request(naver_webtoon_url, function (err, response, body) {
            var $ = cheerio_1.load(body);
            resolve($(".paging_type2").find(".current_pg").find(".total").text() * 1);
        });
    }));
}
var naver_webtoon_info = [];
var naver_comic_url = "https://m.comic.naver.com";
var naver_webtoon_url = naver_comic_url + "/webtoon/finish.nhn?page=";
var get_naver_finished_webtoon = function () { return __awaiter(void 0, void 0, void 0, function () {
    var page_count, _loop_2, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, get_page_count];
            case 1:
                page_count = _a.sent();
                _loop_2 = function (i) {
                    var a_naver_webtoon_info;
                    request(naver_webtoon_url, function (err, response, body) {
                        var $ = cheerio_1.load(body);
                        var page_webtoon_count = $(".list_toon.list_finish")
                            .find(".item")
                            .find(".info").length;
                        for (var webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
                            a_naver_webtoon_info = get_a_naver_webtoon($, ".list_finish", webtoon_num);
                            naver_webtoon_info.push(a_naver_webtoon_info);
                        }
                        console.log(naver_webtoon_info);
                    });
                };
                for (i = 1; page_count; i++) {
                    _loop_2(i);
                }
                return [2 /*return*/];
        }
    });
}); };
get_naver_finished_webtoon();
var get_a_naver_webtoon = function ($, index, webtoon_num) {
    var get_title = $(".list_toon.list_finish")
        .find(".info")
        .eq(webtoon_num)
        .find(".title")
        .text();
    var get_artist = $(".list_toon.list_finish")
        .find(".info")
        .eq(webtoon_num)
        .find(".author")
        .text();
    var get_url = naver_comic_url +
        $(".list_toon.list_finish").find("a").eq(webtoon_num).attr("href");
    var get_img = $(".list_toon.list_finish")
        .find(".thumbnail")
        .eq(webtoon_num)
        .find("img")
        .attr("src");
    return ({
        title: get_title,
        artist: get_artist,
        url: get_url,
        img: get_img,
        service: "Naver",
        state: "완결",
        weekday: 7
    });
};
/*var naver_webtoon = [];

get_webtoon_info();
function_finish_check();

async function get_webtoon_info() {
  var page_count = await get_page_count();
  for (i = 1; i <= page_count; i++) {
    request(naver_webtoon_url + i, function (err, response, body) {
      $ = load(body);
      var page_webtoon_count = $(".list_toon.list_finish")
        .find(".item")
        .find(".info").length;
      for (webtoon_num = 0; webtoon_num < page_webtoon_count; webtoon_num++) {
        var a_weboon_info = {};

        //웹툰 타이틀 정보
        a_weboon_info.title = $(".list_toon.list_finish")
          .find(".info")
          .eq(webtoon_num)
          .find(".title")
          .text();

        //웹툰 작가 정보
        a_weboon_info.artist = $(".list_toon.list_finish")
          .find(".info")
          .eq(webtoon_num)
          .find(".author")
          .text();

        //웹툰 이미지 정보
        a_weboon_info.img = $(".list_toon.list_finish")
          .find(".thumbnail")
          .eq(webtoon_num)
          .find("img")
          .attr("src");

        //웹툰 url 정보
        a_weboon_info.url =
          naver_comic_url +
          $(".list_toon.list_finish").find("a").eq(webtoon_num).attr("href");

        //웹툰 요일 정보
        a_weboon_info.weekday = 7;

        //웹툰 상태 정보
        a_weboon_info.state = "완결";

        //웹툰 사이트 정보
        a_weboon_info.service = "Naver";

        naver_webtoon.push(a_weboon_info);
      }
    });
  }
}



function function_finish_check() {
  var webtoon_count_change = [];
  var interval = setInterval(function () {
    webtoon_count_change.push(naver_webtoon.length);
    if (
      webtoon_count_change[webtoon_count_change.length - 2] ==
      webtoon_count_change[webtoon_count_change.length - 1]
    ) {
      var naver_finished_result = naver_webtoon;
      parentPort.postMessage(naver_finished_result);
      parentPort.close();
      clearInterval(interval);
    }
  }, 1000);
}*/ 
