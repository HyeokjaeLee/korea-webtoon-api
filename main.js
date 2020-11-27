const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const port = 3000;
const app = express();
var update_date;
var webtoon_title_all_weekday = [];
var webtoon_img_all_weekday = [];
var webtoon_url_all_weekday = [];
//request 모듈 사용
var Naver_comic_url = "https://comic.naver.com";
var Naver_Webtoon_weekday_url = Naver_comic_url + "/webtoon/weekday.nhn";
function Naver_Webtoon_data_update() {
  request(Naver_Webtoon_weekday_url, function (err, response, body) {
    //변수 선언
    var $ = cheerio.load(body);
    //데이터 추출
    for (week_num = 0; week_num < 7; week_num++) {
      var webtoon_title = [];
      var webtoon_url = [];
      var webtoon_img = [];
      var webtoon_total_count = $(".col").eq(week_num).find(".title").length;
      for (webtoon_num = 0; webtoon_num < webtoon_total_count; webtoon_num++) {
        webtoon_title[webtoon_num] = $(".col")
          .eq(week_num)
          .find(".title")
          .eq(webtoon_num)
          .text()
          .trim();
        webtoon_url[webtoon_num] =
          Naver_comic_url +
          $(".col").eq(week_num).find(".title").eq(webtoon_num).attr("href");
        webtoon_img[webtoon_num] = $(".col")
          .eq(week_num)
          .find("img")
          .eq(webtoon_num)
          .attr("src");
      }
      webtoon_title_all_weekday[week_num] = webtoon_title;
      webtoon_url_all_weekday[week_num] = webtoon_url;
      webtoon_img_all_weekday[week_num] = webtoon_img;
    }

    console.log(webtoon_title_all_weekday);
    console.log(webtoon_url_all_weekday);
    console.log(webtoon_img_all_weekday);
  });

  app.get("/", (req, res) => {
    res.send(webtoon_img_all_weekday);
  });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

setInterval(function () {
  Naver_Webtoon_data_update();
}, 1000);
