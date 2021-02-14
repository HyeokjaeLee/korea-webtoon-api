import express from "express";
import cors from "cors";
import { Worker } from "worker_threads";
import http from "http";
const exp = express();
exp.use(cors());

export const createRouter = (router: string, data: any, router_list?: string[]): void => {
  exp.get(router, function (request: any, response: { json: (arg: any[]) => void }) {
    response.json(data);
  });
  router_list?.push(router);
};

export const hosting = (port: number): void => {
  exp.listen(process.env.PORT || port, function () {
    console.log(`API hosting started on port ${port}`);
  });
};

export const getData_from_Worker = (dir: string) => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(dir);
    worker.on("message", (data) => resolve(data));
  });
};

export const keepHosting = (url: string) => {
  setInterval(function () {
    http.get(url);
  }, 600000);
};
