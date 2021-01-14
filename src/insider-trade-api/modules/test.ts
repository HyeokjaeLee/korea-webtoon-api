const yahooStockPrices = require("yahoo-stock-prices");
import type { A_trade_data } from "./base_modules";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
const get_a_data = async (ticker: string, start_date?: string, end_date?: string) => {
  const date_arr = (date_str: string) => {
    const date = new Date(date_str);
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  };
  //날짜 안받을경우
  let start_date_arr;
  if (start_date != undefined) {
    start_date_arr = date_arr(start_date);
  } else {
    start_date_arr = { year: 0, month: 0, day: 0 };
  }
  let end_date_arr;
  if (end_date != undefined) {
    end_date_arr = date_arr(end_date);
  } else {
    end_date_arr = date_arr(String(new Date()));
  }
  const stock_original_data = await yahooStockPrices.getHistoricalPrices(
    start_date_arr.month,
    start_date_arr.day,
    start_date_arr.year,
    end_date_arr.month,
    end_date_arr.day,
    end_date_arr.year,
    ticker,
    "1d",
  );
  const stock_processed_data = stock_original_data.map((data: any) => {
    const date = new Date("1970-1-1");
    date.setSeconds(date.getSeconds() + data.date);
    return {
      date: date,
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
    };
  });
  return stock_processed_data;
};

const test = async () => {
  const test_json: any = get_json_data("https://toy-projects-api.herokuapp.com/insidertrade/lists");
  const prices = await get_a_data(test_json[0].ticker);
  console.log(prices);
};

test();
