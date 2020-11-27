const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const port = 3000;
const app = express();
var cors = require("cors")();
app.use(cors);
var update_date;
var naver_webtoon_info_total = [];
var naver_comic_url = "https://comic.naver.com";
var naver_webtoon_weekday_url = naver_comic_url + "/webtoon/weekday.nhn";
var webtoon_info_total = [];
//네이버 웹툰 정보 크롤링
function naver_webtoon_data_update() {
  request(naver_webtoon_weekday_url, function (err, response, body) {
    var $ = cheerio.load(body);
    for (week_num = 0; week_num < 7; week_num++) {
      var naver_webtoon_info_weekday = [];
      var naver_webtoon_count = $(".col").eq(week_num).find(".title").length;
      for (webtoon_num = 0; webtoon_num < naver_webtoon_count; webtoon_num++) {
        naver_webtoon_info = {};
        naver_webtoon_info.title = $(".col")
          .eq(week_num)
          .find(".title")
          .eq(webtoon_num)
          .text()
          .trim();
        naver_webtoon_info.url =
          naver_comic_url +
          $(".col").eq(week_num).find(".title").eq(webtoon_num).attr("href");
        naver_webtoon_info.img = $(".col")
          .eq(week_num)
          .find("img")
          .eq(webtoon_num)
          .attr("src");
        naver_webtoon_info_weekday[webtoon_num] = naver_webtoon_info;
      }
      naver_webtoon_info_total[week_num] = naver_webtoon_info_weekday;
    }
    webtoon_info_total[0] = naver_webtoon_info_total;
  });
  app.get("/", (req, res) => {
    res.send(webtoon_info_total);
  });
}
-app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
setInterval(function () {
  naver_webtoon_data_update();
}, 1000);
//naver_json_data = JSON.stringify(naver_webtoon_info_total);
