import path from "path";
import express from "express";
import cors from "cors";
import { setTimer_loop, ms2hour, ms2minute } from "./modules/common_modules";
import { create_router, hosting, get_data_from_worker, keep_host } from "./modules/index_modules";
const exp = express();
exp.use(cors());
keep_host("http://toy-projects-api.herokuapp.com/");
const korea_covid19_dir = path.join(__dirname, "./worker/korea-covid19-api.js");
const insider_trade_dir = path.join(__dirname, "./worker/insider-trade-api.js");
const korean_webtoon_dir = path.join(__dirname, "./worker/korean-webtoon-api.js");
//------------------------------------------------------------------------
const main = () => {
  setTimer_loop(ms2hour(12), update_insider_trade_api);
  setTimer_loop(ms2minute(10), update_korean_webtoon_api);
  setTimer_loop(ms2hour(1), update_korea_covid19_api);
  hosting(8080);
};
//------------------------------------------------------------------------
const update_korea_covid19_api = async () => {
  create_router("/covid19/korea", await get_data_from_worker(korea_covid19_dir));
};
const update_insider_trade_api = async () => {
  const data: any = await get_data_from_worker(insider_trade_dir);
  const insider_trade_list_data = data.insider_trade_list;
  const stock_data = data.stock_data;
  stock_data.map((data: any) => {
    const stock_data = data.slice(1).reverse();
    const ticker = data[0];
    create_router(`/insidertrade/${ticker}`, stock_data);
  });
  create_router("/insidertrade/list", insider_trade_list_data);
};
const update_korean_webtoon_api = async () => {
  const data: any = await get_data_from_worker(korean_webtoon_dir);
  data.sort((a: any, b: any) => {
    return a.title < b.title ? -1 : 1;
  });
  create_router("/webtoon/all", data);
};
main();
