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
var test;
var naver_dl = document.getElementById("naver_dl");

ajax_get("http://localhost:3000", function (data) {
  for (i = 0; i < data[0][0].length; i++) {
    var new_dt = document.createElement("dt");
    var new_dd = document.createElement("dd");
    new_dt.style.objectFit = "cover";
    new_dd.style.textAlign = "center";
    new_dd.style.fontSize = "70%";
    new_dt.style.marginBottom = "10%";
    new_dd.style.margin = 0;
    new_dt.innerHTML =
      "<img style='object-fit:cover;width:100%;margin-bottom:5%'src=" +
      data[0][0][i].img +
      ">";
    new_dd.innerHTML = data[0][0][i].title;
    naver_dl.appendChild(new_dt);
    new_dt.appendChild(new_dd);
  }
});
