var { ajax_get } = require("../modules/main_modules");
const { parentPort } = require("worker_threads");
var daum_overall_info = [];
var title = [];
var index_num;

daum_webtoon();

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
  for (i = 0; i < 9; i++) {
    ajax_get(daum_json_url + url_package[i], function (data) {
      for (k = 0; k < data.data.length; k++) {
        var info = {};
        info.title = data.data[k].title;
        title[index_num] = info.title;
        info.artist = data.data[k].cartoon.artists[0].penName;
        info.url =
          "http://webtoon.daum.net/m/webtoon/view/" + data.data[k].nickname;
        info.img = data.data[k].thumbnailImage2.url;
        info.service = "Daum"; //다음
        var state_variable = data.data[k].restYn;
        var day_variable;
        if (6 < i) {
          info.state = "완결";
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
            info.state = "UP";
          } else if (state_variable == "Y") {
            info.state = "휴재";
          } else {
            info.state = "";
          }
          info.weekday = i;
        }
        daum_info[index_num] = info;
        index_num++;
      }
    });
  }
  const set = new Set(title);
  const unique_title = [...set];
  for (i = 0; i < unique_title.length; i++) {
    var middle_array = daum_info.filter(function (element) {
      return element.title == unique_title[i];
    });
    daum_overall_info[i] = middle_array[0];
    var result_3 = daum_overall_info;
  }
  parentPort.postMessage(result_3);
  parentPort.close();
}
