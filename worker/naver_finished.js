const request = require("request");
const cheerio = require("cheerio");
const { parentPort } = require("worker_threads");

var naver_comic_url = "https://comic.naver.com";
var naver_artist_url = naver_comic_url + "/webtoon/artist.nhn";
var $;
var index_num;

function naver_all_webtoon() {
  index_num = 0;
  return new Promise(function (resolve, reject) {
    request(naver_artist_url, function (err, response, body) {
      var naver_finished_info = [];
      $ = cheerio.load(body);
      var naver_artist_count = $(".section").find(".work_list").find("h5")
        .length;
      for (i = 0; i < naver_artist_count; i++) {
        var naver_artist = $(".section")
          .find(".work_list")
          .find("h5")
          .eq(i)
          .text();
        var naver_artist_webtoon_count = $(".section")
          .find(".work_list")
          .find("ul")
          .eq(i)
          .find("li").length;
        for (k = 0; k < naver_artist_webtoon_count; k++) {
          var info = {};
          info.title = $(".section")
            .find(".work_list")
            .find("ul")
            .eq(i)
            .find("li")
            .eq(k)
            .find("a")
            .attr("title");
          info.artist = naver_artist;
          info.url =
            naver_comic_url +
            $(".section")
              .find(".work_list")
              .find("ul")
              .eq(i)
              .find("li")
              .eq(k)
              .find("a")
              .attr("href");
          info.img = $(".section")
            .find(".work_list")
            .find("ul")
            .eq(i)
            .find("li")
            .eq(k)
            .find(".thumb")
            .find("img")
            .attr("src");
          info.service = "1"; //네이버
          info.state = -1; //완결 삭제 예정
          info.weekday = 7; //완결 삭제 예정
          naver_finished_info[index_num] = info;
          index_num++;
        }
      }
      resolve(naver_finished_info);
    });
  });
}

var naver_weekday_url = naver_comic_url + "/webtoon/weekday.nhn";
function naver_weekday_webtoon() {
  index_num = 0;
  return new Promise(function (resolve, reject) {
    request(naver_weekday_url, function (err, response, body) {
      var naver_weekday_info = [];
      $ = cheerio.load(body);
      for (week_num = 0; week_num < 7; week_num++) {
        var naver_weekday_count = $(".col").eq(week_num).find(".title").length;
        for (
          webtoon_num = 0;
          webtoon_num < naver_weekday_count;
          webtoon_num++
        ) {
          var info = {};
          info.title = $(".col")
            .eq(week_num)
            .find(".thumb")
            .eq(webtoon_num)
            .find("img")
            .attr("title");

          info.img = $(".col")
            .eq(week_num)
            .find(".thumb")
            .eq(webtoon_num)
            .find("img")
            .attr("src");

          info.url =
            naver_comic_url +
            $(".col")
              .eq(week_num)
              .find(".thumb")
              .eq(webtoon_num)
              .find("a")
              .attr("href");

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
      resolve(naver_weekday_info);
    });
  });
}
function naver_webtoon(naver_weekday_info, naver_finished_info) {
  return new Promise(function (resolve, reject) {
    for (n = 0; n < naver_weekday_info.length; n++) {
      index_num = naver_finished_info.findIndex(
        (i) => i.title == naver_weekday_info[n].title
      );
      naver_finished_info[index_num] = {
        ...naver_finished_info[index_num],
        ...naver_weekday_info[n],
      };
    }
    resolve(naver_finished_info);
  });
}

async function naver_info() {
  naver_finished_info = await naver_all_webtoon();
  naver_weekday_info = await naver_weekday_webtoon();
  var result_1 = await naver_webtoon(naver_finished_info, naver_weekday_info);
  parentPort.postMessage(result_1);
  parentPort.close();
}

naver_info();
