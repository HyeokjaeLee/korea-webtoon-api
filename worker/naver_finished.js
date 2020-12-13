const request = require("request");
const cheerio = require("cheerio");
const { parentPort } = require("worker_threads");
var naver_comic_url = "https://m.comic.naver.com";
var naver_webtoon_url = naver_comic_url + "/webtoon/finish.nhn?page=";
var $;
var naver_webtoon = [];

get_webtoon_info();
function_finish_check();

async function get_webtoon_info() {
  var page_count = await get_page_count();
  for (i = 1; i <= page_count; i++) {
    request(naver_webtoon_url + i, function (err, response, body) {
      $ = cheerio.load(body);
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

        //웹툰 이미지 정보
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

function get_page_count() {
  return new Promise(function (resolve, reject) {
    request(naver_webtoon_url, function (err, response, body) {
      $ = cheerio.load(body);
      resolve($(".paging_type2").find(".current_pg").find(".total").text() * 1);
    });
  });
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
}
