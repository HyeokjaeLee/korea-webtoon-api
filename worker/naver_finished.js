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
          info.service = 1; //네이버
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

async function naver_info() {
  naver_finished_info = await naver_all_webtoon();
  var result_1 = naver_finished_info;
  parentPort.postMessage(result_1);
  parentPort.close();
}

naver_info();
