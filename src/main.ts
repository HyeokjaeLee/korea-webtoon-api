import path from "path";
import express, {
  request,
  Request,
  RequestHandler,
  response,
  Response,
} from "express";
import cors from "cors";
import { Worker } from "worker_threads";
import http from "http";
import {
  convertDateFormat,
  setTimer_loop,
  ms2hour,
  ms2minute,
} from "./function/FormatConversion";
import mongoose from "mongoose";
//const User = require ("./Schema/test")
import bodyParser from "body-parser";
import type * as Covid19 from "./type/type.covid19";
import type * as InsiderTrade from "./type/type.insider-trade";
import type { Webtoon } from "./type/type.webtoon";

const exp = express();
exp.use(cors());
const hosting_url = "http://toy-projects-api.herokuapp.com/";
/*const test_key = "leehyeokjae"
const pw = "44nud95974";
const dbAddress = `mongodb+srv://leehyeokjae97:${pw}@toyproject-cluster.8xhpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose
  .connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));*/

/* User.create('inyong', '1254')
.then((user: any)=>{
  console.log(user); // 저장된 유저 정보 출력
});*/

//------------------------------------------------------------------------
const main = () => {
  hosting(8080);
  keepHosting(hosting_url); //호스팅 유지

  //InsiderTradeAPI 부분
  {
    const insiderTradeWorker = pathDir("./worker/worker.insidertrade.ts");
    const updateInsiderTradeAPI = async () => {
      const insiderTrade = new Router("insidertrade");
      const wokrer_data = await getData_from_Worker(insiderTradeWorker);
      const totalStockData: InsiderTrade.Final[] = wokrer_data.stockData;
      const listData: InsiderTrade.OpenInsider[] = wokrer_data.insiderTradeInfo;
      insiderTrade.createRouter("list", (req, res) => {
        res.json(listData);
      });
      totalStockData.map((aStockData) => {
        const ticker = aStockData.ticker;
        insiderTrade.createRouter(ticker, (req, res) => {
          let stockInfo = aStockData.data;
          const from = req.query.from;
          const to = req.query.to;
          if (from != undefined) {
            stockInfo = stockInfo?.filter(
              (data) => dateForm(data.date) >= Number(from)
            );
          }
          if (to != undefined) {
            stockInfo = stockInfo?.filter(
              (data) => dateForm(data.date) <= Number(to)
            );
          }
          res.json(stockInfo);
        });
      });
      insiderTrade.createIndexRouter();
    };
    setTimer_loop(ms2hour(12), updateInsiderTradeAPI);
  }

  // WebtoonAPI 부분
  {
    const webtoonWorker = pathDir("./worker/worker.webtoon.ts");
    const updateWebtoonAPI = async () => {
      const webtoon = new Router("webtoon");
      const wokrer_data: Webtoon[] = await getData_from_Worker(webtoonWorker);
      webtoon.createRouter("info", (req, res) => {
        let webtoonInfo = wokrer_data;
        const weeknum = req.query.weeknum;
        const service = req.query.service;
        if (weeknum != undefined) {
          webtoonInfo = webtoonInfo.filter(
            (aWebtoonInfo) => aWebtoonInfo.weekday == Number(weeknum)
          );
        }
        if (service != undefined) {
          webtoonInfo = webtoonInfo.filter(
            (aWebtoonInfo) => aWebtoonInfo.service == service
          );
        }
        res.json(webtoonInfo);
      });
      webtoon.createIndexRouter();
    };
    setTimer_loop(ms2minute(10), updateWebtoonAPI);
  }

  //Covid19API 부분
  {
    const covid19Worker = pathDir("./worker/worker.covid19.ts");
    const updateCovid19API = async () => {
      const covid19 = new Router("covid19");
      const wokrer_data: Covid19.Final[] = await getData_from_Worker(
        covid19Worker
      );
      wokrer_data.map((covidData) => {
        covid19.createRouter(covidData.region, (req, res) => {
          let covidInfo = covidData.data;
          const from = req.query.from;
          const to = req.query.to;
          if (from != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) >= Number(from)
            );
          }
          if (to != undefined) {
            covidInfo = covidInfo.filter(
              (data) => dateForm(data.date) <= Number(to)
            );
          }
          res.json(covidInfo);
        });
      });
      covid19.createIndexRouter();
    };
    setTimer_loop(ms2hour(1), updateCovid19API);
  }
};
//------------------------------------------------------------------------
class Router {
  public path: string;
  public routerList: string[] = [];
  constructor(title: string) {
    this.path = `/${title}`;
  }

  public createRouter = (name: string, handler: RequestHandler) => {
    const _path = `${this.path}/${name}`;
    this.routerList.push(_path);
    exp.get(_path, handler);
  };

  public createIndexRouter = () => {
    console.log("routerList");
    console.log(this.routerList);
    exp.get(this.path, (req, res) => {
      res.json(this.routerList);
    });
  };
}

const dateForm = (date: Date) => Number(convertDateFormat(date, "")); //queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326

const pathDir = (dir: string) =>
  path.join(__dirname, dir.replace(".ts", ".js"));

const hosting = (port: number): void => {
  exp.listen(process.env.PORT || port, function () {
    console.log(`API hosting started on port ${port}`);
  });
};

const getData_from_Worker = (dir: string): any => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(dir);
    worker.on("message", (data) => resolve(data));
  });
};

const keepHosting = (url: string) => {
  setInterval(function () {
    http.get(url);
  }, ms2hour(1));
};

main();
