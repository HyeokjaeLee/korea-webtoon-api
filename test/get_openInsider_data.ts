const request = require("request-promise-native");
import { load } from "cheerio";
//import { string2date } from "../../modules/FormatConversion";
//import type { A_trade_data } from "../../modules/types";
const $2num = (string_data: string) =>
  Number(string_data.replace("$", "").replace(/,/gi, ""));
const _get_buy_data = async () => {
  const openInsider_data:any[] = [];
  const openInsiderURL = "http://openinsider.com/insider-purchases-25k";
  await request(
    openInsiderURL,
    (err: string, response: object[], body: string) => {
      const $ = load(body);
      const baseSelector = $("#tablewrapper > table > tbody > tr");
      baseSelector.map((index, element) => {
        const get_a_data = (dir_num: number) =>
          $(element).find(`td:nth-child(${dir_num})`).text();
        const get_info = () => ({
          ticker: get_a_data(3).replace(/ /gi, ""),
          trade_date: get_a_data(2),
          company_name: get_a_data(4),
          insider_name: get_a_data(5),
          price: get_a_data(8),
          qty: get_a_data(9),
          owned: get_a_data(10),
          value: get_a_data(12),
        });
        openInsider_data.push(get_info());
      });
    }
  );
  console.log(openInsider_data);
};
//#tablewrapper > table > tbody > tr:nth-child(1) > td:nth-child(4) > b > a
_get_buy_data();
/*const get_buy_data = (url: string):A_trade_data[]|any => {
  return new Promise((resolve) => {
    request(url, (err: string, response: object[], body: string) => {
      $ = load(body);
      let data: A_trade_data[] = [];
      const column_count: number = $("#tablewrapper > table > tbody > tr").length;
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

const get_a_data = (column_num: number): A_trade_data => ({
  ticker: get_a_data_part(column_num, 3).replace(/ /gi, ""),
  trade_date: string2date(get_a_data_part(column_num, 2)),
  company_name: get_a_data_part(column_num, 4),
  insider_name: get_a_data_part(column_num, 5),
  price: $2num(get_a_data_part(column_num, 8)),
  qty: $2num(get_a_data_part(column_num, 9)),
  owned: $2num(get_a_data_part(column_num, 10)),
  value: $2num(get_a_data_part(column_num, 12)),
});

export default get_buy_data;*/
