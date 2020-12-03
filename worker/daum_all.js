var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { parentPort } = require("worker_threads");

function ajax_get(url, callback) {
  //ajax 구현을 위한 함수
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
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

var index_num;
function daum_webtoon() {
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
        info.service = 2; //다음
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
  var result_3 = daum_info;
  parentPort.postMessage(result_3);
  parentPort.close();
}

daum_webtoon();
