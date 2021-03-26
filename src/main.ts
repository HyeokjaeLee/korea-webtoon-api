import path from "path";
import express, { Request, RequestHandler, response, Response } from "express";
import cors from "cors";
import { setTimer_loop, ms2hour, ms2minute } from "./modules/FormatConversion";
import { Worker } from "worker_threads";
import http from "http";
import {query2Date} from "./modules/checking"
import type {
  TotalStockInfo,
  A_trade_data,
  A_webtoon_info,
  covid19API,
  WebtoonContainer,
} from "./modules/types";
const exp = express();
exp.use(cors());
const hosting_url = "http://toy-projects-api.herokuapp.com/";

//------------------------------------------------------------------------
const main = () => {
  hosting(8080);
  keepHosting(hosting_url); //호스팅 유지
  {
    exp.get("/", function (request, response) {
      if (request.query.id != undefined) {
        response.send(request.query.id);
      } else {
        response.send("test3");
      }
    });
  }
  //InsiderTradeAPI 부분
  {
    const insiderTradeWorker = pathDir("./insider-trade-api/index.ts");
    const updateInsiderTradeAPI = async () => {
      const insiderTrade = new Router("insidertrade");
      const wokrer_data = await getData_from_Worker(insiderTradeWorker);
      const totalStockData: TotalStockInfo[] = wokrer_data.stockData;
      const listData: A_trade_data[] = wokrer_data.insiderTradeList;
      insiderTrade.createRouter(listData, "list");
      totalStockData.map((aStockData) => {
        const ticker = aStockData.ticker;
        insiderTrade._createRouter((req, res) => {
          let from:any = query2Date(req.query.from);
          let to:any = query2Date(req.query.to);
          const index: string = ""; //querysString으로 받은 값에 따른 필터링을 위한 구분값
          if (from != undefined) {
            index + "from";
          }
          if (to != undefined) {
            index + "to";
          }
          switch (index) {
            case "from": {
              res.json(aStockData.data?.filter(info=>{const date = new Date(info.date)}))
              break;
            }

            case "to": {
              break;
            }
            case "fromto": {
              break;
            }
            default: {
              res.json(aStockData)
              break;
            }
          }
        }, ticker);
      });
      insiderTrade.createIndexRouter();
    };
    setTimer_loop(ms2hour(12), updateInsiderTradeAPI);
  }

  // WebtoonAPI 부분
  {
    const webtoonWorker = pathDir("./korean-webtoon-api/index.ts");
    const updateWebtoonAPI = async () => {
      const webtoon = new Router("webtoon");
      const wokrer_data: A_webtoon_info[] = await getData_from_Worker(
        webtoonWorker
      );
      const classification: WebtoonContainer[] = [
        { index: "sun", webtoon: [] },
        { index: "mon", webtoon: [] },
        { index: "tue", webtoon: [] },
        { index: "wed", webtoon: [] },
        { index: "thu", webtoon: [] },
        { index: "fri", webtoon: [] },
        { index: "sat", webtoon: [] },
        { index: "finished", webtoon: [] },
        { index: "Naver", webtoon: [] },
        { index: "Daum", webtoon: [] },
        { index: "all", webtoon: wokrer_data },
      ];
      wokrer_data.map((data) => {
        classification[data.weekday].webtoon.push(data);
        switch (data.service) {
          case "Naver":
            classification[8].webtoon.push(data);
            break;
          case "Daum":
            classification[9].webtoon.push(data);
            break;
        }
      });
      classification.map((data) => {
        webtoon.createRouter(data.webtoon, data.index);
      });
      webtoon.createIndexRouter();
    };
    setTimer_loop(ms2minute(10), updateWebtoonAPI);
  }

  //Covid19API 부분
  {
    const covid19Worker = pathDir("./korea-covid19-api/index.ts");
    const updateCovid19API = async () => {
      const covid19 = new Router("covid19");
      const wokrer_data: covid19API[] = await getData_from_Worker(
        covid19Worker
      );
      wokrer_data.map((data) => {
        covid19.createRouter(data, data.region);
      });
      covid19.createIndexRouter();
    };
    setTimer_loop(ms2hour(1), updateCovid19API);
  }
};
//------------------------------------------------------------------------
exp.get("/");
class Router {
  public title: string;
  public routerList: string[] = [];
  constructor(title: string) {
    this.title = title;
  }

  public _createRouter = (handler: RequestHandler, name?: string) => {
    let path: string = `/${this.title}`;
    if (name != undefined) {
      path = path + `/${name}`;
      this.routerList.push(path);
    }
    exp.get(path, handler);
  };

  public createRouter = (data: any, router?: string): void => {
    let router_url: string;
    if (router != undefined) {
      router_url = `/${this.title}/${router}`;
      this.routerList.push(router_url);
    } else {
      router_url = `/${this.title}`;
    }
    exp.get(router_url, function (req, response) {
      response.json(data);
    });
  };
  public createIndexRouter = () => {
    console.log("routerList");
    console.log(this.routerList);
    this.createRouter(this.routerList);
  };
}

const pathDir = (dir: string) =>
  path.join(__dirname, dir.replace(".ts", ".js"));

const hosting = (port: number): void => {
  exp.listen(process.env.PORT || port, function () {
    console.log();
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
