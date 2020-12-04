const request = require("request");
const cheerio = require("cheerio");
const { parentPort } = require("worker_threads");

var naver_comic_url = "https://comic.naver.com";
var naver_artist_url = naver_comic_url + "/webtoon/artist.nhn";
var $;
var index_num;
var naver_overall_info = [];
var title = [];

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
          title[index_num] = info.title;
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
          info.state = 3; //완결 삭제 예정
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
  const set = new Set(title);
  const unique_title = [...set];
  for (i = 0; i < unique_title.length; i++) {
    var middle_array = naver_finished_info.filter(function (element) {
      return element.title == unique_title[i];
    });
    if (middle_array.length == 1) {
      naver_overall_info[i] = middle_array[0];
    } else {
      var middle_array_artist = [];
      for (k = 0; k < middle_array.length; k++) {
        middle_array_artist[k] = middle_array[k].artist;
      }
      middle_array[0].artist = middle_array_artist;
      naver_overall_info[i] = middle_array[0];
    }
  }
  var result_1 = naver_overall_info;
  parentPort.postMessage(result_1);
  parentPort.close();
}

naver_info();
