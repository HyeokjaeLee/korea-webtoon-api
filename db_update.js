const request = require("request");
const cheerio = require("cheerio");
const express = require("express");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function ajax_get(url, callback) {
  //ajax 구현을 위한 함수
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("responseText:" + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };
  xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
  xmlhttp.send();
}

var naver_comic_url = "https://comic.naver.com";
//request 모듈 사용
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
function daum_webtoon() {
  return new Promise(function (resolve, reject) {
    var daum_info = [];
    index_num = 0;
    var daum_json_url = "http://webtoon.daum.net/data/pc/webtoon";
    var url_package = [
      "/list_serialized/mon",
      "/list_serialized/tue",
      "/list_serialized/wed",
      "/list_serialized/thu",
      "/list_serialized/fri",
      "/list_serialized/sat",
      "/list_serialized/sun",
      "/list_finished/free",
      "/list_finished/pay",
    ];
    for (i = 0; i < 10; i++) {
      ajax_get(daum_json_url + url_package[i], function (data) {
        for (k = 0; k < data.data.length; k++) {
          var info = {};
          info.title = data.data[k].title;
          info.artist = data.data[k].cartoon.artists[0].penName;
          info.url =
            "http://webtoon.daum.net/webtoon/view/" + data.data[k].nickname;
          info.img = data.data[k].thumbnailImage2.url;
          info.service = "2"; //다음
          var state_variable = data.data[k].restYn;
          var day_variable;
          if (6 < i) {
            info.state = -1;
            info.weekday = 7;
          } else {
            switch (i) {
              case 0:
                day_variable = 1;
                break;
              case 1:
                day_variable = 2;
                break;
              case 2:
                day_variable = 3;
                break;
              case 3:
                day_variable = 4;
                break;
              case 4:
                day_variable = 5;
                break;
              case 5:
                day_variable = 6;
                break;
              case 6:
                day_variable = 0;
                break;
              default:
                day_variable = 7;
                break;
            }
            if (new Date().getDay() == day_variable && state_variable == "N") {
              info.state = 1;
            } else if (state_variable == "Y") {
              info.state = 2;
            } else {
              info.state = 0;
            }
            info.weekday = i;
          }
          daum_info[index_num] = info;
          index_num++;
        }
      });
    }
    resolve(daum_info);
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

async function webtoon_info() {
  var app = express();
  naver_finished_info = await naver_all_webtoon();
  naver_weekday_info = await naver_weekday_webtoon();
  var naver_info = await naver_webtoon(naver_finished_info, naver_weekday_info);
  var daum_info = await daum_webtoon();
  var webtoon = naver_info.concat(daum_info);
  var webtoon_json_data = JSON.stringify(webtoon);
  app.get("/", function (request, response) {
    response.send(webtoon_json_data); // HelloWorld를 전송한다.
  });

  app.listen(process.env.PORT || 8080, function () {
    console.log("webtoon api hosting started on port 3000.");
    //3000번 포트에서 Express서버를 시작하고 시작했다는 로그 기록
  });
}

webtoon_info();
