import * as convert from "xml-js";
import * as request from "request";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export const get_json_data = (url: string) => {
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

export const get_api_xml2json = (url: string) => {
  return new Promise((resolve, reject) => {
    request.get(url, (err: any, res: any, body: any) => {
      if (err) {
        console.log(`err => ${err}`);
      } else {
        if (res.statusCode == 200) {
          const JSON_Data: any = JSON.parse(convert.xml2json(body, { compact: true, spaces: 4 }));
          resolve(JSON_Data);
        }
      }
    });
  });
};

export const getFormatDate = (input_date: Date, form: string) => {
  const date = new Date(input_date);
  const num2str = (num: number) => {
    let result;
    if (num < 10) {
      result = "0" + num;
    } else {
      result = String(num);
    }
    return result;
  };
  let year: number = date.getFullYear(); //yyyy
  let month: string = num2str(1 + date.getMonth()); //M
  let day: string = num2str(date.getDate());

  return year + form + month + form + day;
};

export const string_date_to_date_form = (string_date: string) => {
  const strArr: string[] = string_date.split("-");
  const numArr: number[] = [];
  for (let i = 0; i < 3; i++) {
    numArr[i] = Number(strArr[i]);
  }
  const date: Date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
  return date;
};

export const update_check = (api_name: string, data: any): void => {
  console.log(`\n------------------------${new Date()}------------------------\n`);
  if (data != undefined) {
    console.log(`${api_name} data has been updated successfully.`);
  } else {
    console.log(`${api_name} data update failed.`);
  }
};

export const ms2hour = (hour: number) => hour * 3600000;
export const ms2minute = (minute: number) => minute * 60000;
export const ms2second = (second: number) => second * 1000;
export const setTimer_loop = (sec_num: number, fn: any) => {
  fn();
  setInterval(() => {
    fn();
  }, sec_num);
};
