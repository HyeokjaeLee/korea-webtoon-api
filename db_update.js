const request = require("request");
const cheerio = require("cheerio");

var naver_comic_url = "https://comic.naver.com";
//request 모듈 사용
var naver_artist_url = naver_comic_url + "/webtoon/artist.nhn";
var naver_info = [];
var index_num = 0;
var $;
request(naver_artist_url, function (err, response, body) {
  $ = cheerio.load(body);
  var naver_artist_count = $(".section").find(".work_list").find("h5").length;
  for (i = 0; i < naver_artist_count; i++) {
    var naver_artist = $(".section").find(".work_list").find("h5").eq(i).text();
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
      info.service = "1";
      info.state = "0";
      info.weekday = "0";
      naver_info[index_num] = info;
      index_num++;
    }
  }
  console.log(naver_info);
});
