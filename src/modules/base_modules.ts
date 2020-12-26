var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
interface A_webtoon_info {
  title: string;
  artist: string;
  url: string;
  img: string;
  service: string;
  state: string;
  weekday: number;
}

const weekday: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const get_json_data = (url: string) => {
  let xmlhttp = new XMLHttpRequest();
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

export type { A_webtoon_info };
export { get_json_data, weekday };
