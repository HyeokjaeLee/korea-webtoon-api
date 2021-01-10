const request = require("request-promise-native");
import { load } from "cheerio";
import { $2num, string_date_to_date_form } from "./base_modules";
import type { A_trade_data } from "./base_modules";
let $: cheerio.Root;

const get_buy_data = (url: string) => {
  return new Promise((resolve) => {
    request(url, (err: string, response: object[], body: string) => {
      $ = load(body);
      let data: object[] = [];
      const column_count: number = $(".tinytable").find("tbody").find("tr").length;
      for (let i = 0; i < column_count; i++) {
        data.push(get_a_data(i));
      }
      resolve(data);
    });
  });
};

const get_a_data_part = (column_num: number, row_num: number) => {
  return $(".tinytable").find("tbody").find("tr").eq(column_num).find("td").eq(row_num).text();
};

const get_a_data = (column_num: number): A_trade_data => {
  return {
    ticker: get_a_data_part(column_num, 3),
    trade_date: string_date_to_date_form(get_a_data_part(column_num, 2)),
    company_name: get_a_data_part(column_num, 4),
    insider_name: get_a_data_part(column_num, 5),
    price: $2num(get_a_data_part(column_num, 8)),
    qty: $2num(get_a_data_part(column_num, 9)),
    owned: $2num(get_a_data_part(column_num, 10)),
    value: $2num(get_a_data_part(column_num, 12)),
  };
};

export { get_buy_data };
