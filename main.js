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

ajax_get(api_url, function (data) {
  var test = data[3].title;
  //document.getElementById("webtoon_contents").innerHTML = test;
  for (i = 3; i < data.length; i++) {
    var webtoon_contents = document.getElementById("webtoon_contents");
    var new_dt = document.createElement("dt");
    new_dt.classList.add("square");
    var new_div = document.createElement("div");
    new_div.classList.add("content");

    var new_dd = document.createElement("dd");

    /*new_dt.style.objectFit = "cover";
    new_dt.classList.add("webtoon_img");
    new_dt.style.float = "left";
    new_dt.style.textAlign = "center";
    new_dt.style.fontSize = "30px";
    new_dt.style.marginBottom = "1%";
    new_dt.style.margin = 0;*/
    if (data[i].img == null) {
      new_div.innerHTML =
        "<img style='object-fit:cover;width:100%;margin-bottom:5%'src=img/noimg.jpg width=25% height=15%>";
    } else {
      new_div.innerHTML =
        "<img style='object-fit:cover;width:100%;margin-bottom:5%'src=" +
        data[i].img +
        ">";
    }
    new_dd.innerHTML = data[i].title;
    webtoon_contents.appendChild(new_dt);
    new_dt.appendChild(new_div);
    new_dt.appendChild(new_dd);
  }
});
