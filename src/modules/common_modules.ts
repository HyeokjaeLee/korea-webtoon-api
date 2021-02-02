const get_json_data = (url: string) => {
  const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  const xmlhttp = new XMLHttpRequest();
  let json_data: string = "";
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        json_data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
    }
  };
  xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
  xmlhttp.send();
  return json_data;
};

const string_date_to_date_form = (string_date: string) => {
  const strArr: string[] = string_date.split("-");
  const numArr: number[] = [];
  for (let i = 0; i < 3; i++) {
    numArr[i] = Number(strArr[i]);
  }
  const date: Date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
  return date;
};

export { get_json_data, string_date_to_date_form };
