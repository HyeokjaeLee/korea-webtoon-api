const request = require("request-promise-native");
import { load } from "cheerio";
import type { OpenInsider } from "../type/type.insider-trade";

export const get_opne_insider_data = async () => {
  const openInsider_data: OpenInsider[] = [],
    openInsiderURL: string = "http://openinsider.com/insider-purchases-25k";
  await request(
    openInsiderURL,
    (err: string, response: object[], body: string) => {
      const $ = load(body),
        base_selector = $("#tablewrapper > table > tbody > tr"); //.toArray;
      base_selector.map((index, element) => {
        const get_a_data = (dir_num: number) =>
          $(element).find(`td:nth-child(${dir_num})`).text();
        openInsider_data.push({
          ticker: get_a_data(4).replace(" ", ""),
          trade_date: get_a_data(3),
          company_name: get_a_data(5),
          insider_name: get_a_data(6),
          price: Number(get_a_data(9).replace("$", "")),
          qty: Number(get_a_data(10).replace(/,/gi, "")),
          owned: Number(get_a_data(11).replace(/,/gi, "")),
          value: Number(get_a_data(13).replace("$", "").replace(/,/gi, "")),
        });
      });
    }
  );
  return openInsider_data;
};
