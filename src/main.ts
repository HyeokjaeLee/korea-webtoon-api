import path from "path";
import express from "express";
import cors from "cors";
import { setTimer_loop, ms2hour, ms2minute } from "./modules/FormatConversion";
import { createRouter, hosting, getData_from_Worker, keepHosting } from "./modules/index_modules";
const exp = express();
exp.use(cors());
keepHosting("http://toy-projects-api.herokuapp.com/");
const pathDir = (dir: string) => path.join(__dirname, dir.replace(".ts", ".js"));
const korea_covid19_dir = pathDir("./korea-covid19-api/main.ts");
const insider_trade_dir = pathDir("./insider-trade-api/main.ts");
const korean_webtoon_dir = pathDir("./korean-webtoon-api/main.ts");
//------------------------------------------------------------------------
const main = () => {
  setTimer_loop(ms2hour(12), update_insider_trade_api);
  setTimer_loop(ms2minute(10), update_korean_webtoon_api);
  setTimer_loop(ms2hour(1), update_korea_covid19_api);
  hosting(8080);
};
//------------------------------------------------------------------------
const update_korea_covid19_api = async () => {
  const router_list: string[] = [];
  const data: any = await getData_from_Worker(korea_covid19_dir);
  data.map((data: any) => {
    const region = data.region;
    createRouter(`/covid19/korea/${region}`, data, router_list);
  });
  createRouter("/covid19", router_list);
};
const update_insider_trade_api = async () => {
  const router_list: string[] = [];
  const data: any = await getData_from_Worker(insider_trade_dir);
  const insider_trade_list_data = data.insiderTradeList;
  const stock_data = data.stockData;
  stock_data.map((data: any) => {
    const ticker = data.ticker;
    createRouter(`/insidertrade/${ticker}`, data, router_list);
  });
  createRouter("/insidertrade/list", insider_trade_list_data, router_list);
  createRouter("/insidertrade", router_list);
};
const update_korean_webtoon_api = async () => {
  const router_list: string[] = [];
  const data: any = await getData_from_Worker(korean_webtoon_dir);
  data.sort((a: any, b: any) => {
    return a.title < b.title ? -1 : 1;
  });
  createRouter("/webtoon/all", data, router_list);
  createRouter("/webtoon", router_list);
};
main();
