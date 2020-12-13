const request = require("request");
const cheerio = require("cheerio");
const { parentPort } = require("worker_threads");
var { weekday } = require("../modules/main_modules");
var naver_comic_url = "https://m.comic.naver.com";
var naver_webtoon_url = naver_comic_url + "/webtoon/weekday.nhn?week=";
var $;
var naver_webtoon = [];

get_webtoon_info();
function_finish_check();

function get_webtoon_info() {
  for (week_count = 0; week_count < 7; week_count++) {
    get_weekday_webtoon_info(week_count);
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
      var naver_weekday_result = naver_webtoon;
      parentPort.postMessage(naver_weekday_result);
      parentPort.close();
      clearInterval(interval);
    }
  }, 1000);
}

function get_weekday_webtoon_info(week_count) {
  request(
    naver_webtoon_url + weekday[week_count],
    function (err, response, body) {
      $ = cheerio.load(body);
      var weekday_webtoon_count = $(".list_toon").find(".item").find(".info")
        .length;
      for (
        webtoon_num = 0;
        webtoon_num < weekday_webtoon_count;
        webtoon_num++
      ) {
        var a_weboon_info = {};

        //웹툰 타이틀 정보
        a_weboon_info.title = $(".list_toon")
          .find(".info")
          .eq(webtoon_num)
          .find(".title")
          .text();

        //웹툰 작가 정보
        a_weboon_info.artist = $(".list_toon")
          .find(".info")
          .eq(webtoon_num)
          .find(".author")
          .text();

        //웹툰 이미지 정보
        a_weboon_info.img = $(".list_toon")
          .find(".thumbnail")
          .eq(webtoon_num)
          .find("img")
          .attr("src");

        //웹툰 이미지 정보
        a_weboon_info.url =
          naver_comic_url +
          $(".list_toon").find("a").eq(webtoon_num).attr("href");

        //웹툰 요일 정보
        a_weboon_info.weekday = week_count;

        //웹툰 사이트 정보
        a_weboon_info.service = "Naver";

        //웹툰 상태 정보
        state_variable = $(".list_toon")
          .find(".info")
          .eq(webtoon_num)
          .find(".detail")
          .find(".blind")
          .eq(0)
          .text();

        switch (state_variable) {
          case "휴재":
            a_weboon_info.state = "휴재";
            break;
          case "up":
            a_weboon_info.state = "UP";
            break;
          default:
            a_weboon_info.state = "";
            break;
        }
        naver_webtoon.push(a_weboon_info);
      }
    }
  );
}
