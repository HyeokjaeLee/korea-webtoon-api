const request = require("request");
const cheerio = require("cheerio");
const { parentPort } = require("worker_threads");

var naver_comic_url = "https://comic.naver.com";
var $;
var index_num;
var naver_weekday_url = naver_comic_url + "/webtoon/weekday.nhn";
function naver_weekday_webtoon() {
  index_num = 0;
  request(naver_weekday_url, function (err, response, body) {
    var naver_weekday_info = [];
    $ = cheerio.load(body);
    for (week_num = 0; week_num < 7; week_num++) {
      var naver_weekday_count = $(".col").eq(week_num).find(".title").length;
      for (webtoon_num = 0; webtoon_num < naver_weekday_count; webtoon_num++) {
        var info = {};
        info.title = $(".col")
          .eq(week_num)
          .find(".thumb")
          .eq(webtoon_num)
          .find("img")
          .attr("title");
        info.weekday = week_num;
        var state_variable = $(".col")
          .eq(week_num)
          .find(".thumb")
          .eq(webtoon_num)
          .find("a")
          .find("em")
          .attr("class");
        switch (state_variable) {
          case "ico_updt": //신규화 업데이트
            info.state = 1;
            break;
          case "ico_break": //휴재중
            info.state = 2;
            break;
          default:
            info.state = 0; //연재중
            break;
        }
        naver_weekday_info[index_num] = info;
        index_num++;
      }
    }
    var result_2 = naver_weekday_info;
    parentPort.postMessage(result_2);
    parentPort.close();
  });
}
