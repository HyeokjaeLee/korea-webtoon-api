const api_url = "https://korean-webtoon-hub-project.herokuapp.com/";

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

var target_api = api_url + "mon";
ajax_get(target_api, function (data) {
  //document.getElementById("webtoon_contents").innerHTML = test;
  for (i = 0; i < data.length; i++) {
    var webtoon_contents = document.getElementById("webtoon_contents");
    var webtoon_link = document.createElement("a");
    webtoon_link.href = data[i].url;
    var new_dt = document.createElement("dt");
    new_dt.classList.add("webtoon_container");
    var new_div = document.createElement("div");
    new_div.classList.add("square");
    var img_container = document.createElement("div");
    img_container.classList.add("content");
    var img_text = document.createElement("div");
    img_text.classList.add("icon");
    var new_dd = document.createElement("dd");
    new_dd.classList.add("webtoon_info");
    if (data[i].img == null) {
      img_container.innerHTML = "<img src=img/noimg.jpg width=25% height=15%>";
    } else {
      img_container.innerHTML =
        "<img style='object-fit:cover;width:100%;'src=" + data[i].img + ">";
    }
    new_dd.innerHTML =
      "<p style=font-size:1.3em; text-align:center; margin:0; color:#E50914>" +
      data[i].title +
      "</p><p style=font-size:1em; text-align:center; color:#E50914>" +
      data[i].artist +
      "</p>";

    switch (data[i].service) {
      case 1:
        img_text.innerHTML = "<img src=img/naver.png width=30%>";
        break;
      case 2:
        img_text.innerHTML = "<img src=img/daum.png width=30%>";
        break;
    }
    webtoon_contents.appendChild(webtoon_link);
    webtoon_link.appendChild(new_dt);
    new_dt.appendChild(new_div);
    new_div.appendChild(img_container);
    img_container.appendChild(img_text);
    new_dt.appendChild(new_dd);
  }
});
