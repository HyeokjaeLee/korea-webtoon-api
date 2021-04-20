const request = require("request-promise-native");
import { load } from "cheerio";

const get_buy_data = async () => {
  const openInsider_data: any[] = [],
    openInsiderURL: string = "http://openinsider.com/insider-purchases-25k";
  await request(
    openInsiderURL,
    (err: string, response: object[], body: string) => {
      const $ = load(body),
        base_selector = $("#tablewrapper > table > tbody > tr");
      base_selector.map((index, element) => {
        const get_a_data = (dir_num: number) =>
            $(element).find(`td:nth-child(${dir_num})`).text(),
          get_info = () => ({
            ticker: get_a_data(4),
            trade_date: get_a_data(3),
            company_name: get_a_data(5),
            insider_name: get_a_data(6),
            price: Number(get_a_data(9).replace("$", "")),
            qty: Number(get_a_data(10).replace(/,/gi, "")),
            owned: Number(get_a_data(11).replace(/,/gi, "")),
            value: Number(get_a_data(13).replace("$", "").replace(/,/gi, "")),
          });
        openInsider_data.push(get_info());
      });
    }
  );
  console.log(openInsider_data);
};
get_buy_data();
