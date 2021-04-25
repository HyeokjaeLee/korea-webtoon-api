import * as convert from "xml-js";
import * as request from "request";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export const getJsonAPI = (url: string) => {
  const xmlhttp = new XMLHttpRequest();
  let json_data: any;
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        json_data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
      }
    }
  };
  xmlhttp.open("GET", url, false); //true는 비동기식, false는 동기식 true로 할시 변수 변경전에 웹페이지가 떠버림
  xmlhttp.send();
  return json_data;
};

export const getXmlAPI2JSON = (url: string): any => {
  return new Promise((resolve, reject) => {
    request.get(url, (err: any, res: any, body: any) => {
      if (err) {
        console.log(`err => ${err}`);
      } else {
        if (res.statusCode == 200) {
          const JSON_Data: any = JSON.parse(
            convert.xml2json(body, { compact: true, spaces: 4 }),
          );
          resolve(JSON_Data);
        }
      }
    });
  });
};
