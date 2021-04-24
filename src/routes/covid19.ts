import { Worker } from "worker_threads";
import express from "express";
const router = express.Router();
import path from "path";

// router.get 으로 사용합니다

const getData_from_Worker = (_workerName:string): any => {
  return new Promise(function (resolve, reject) {
const workerDir = path.join(__dirname,`../worker/${_workerName}-worker.js`),
 worker = new Worker(workerDir);
worker.on("message",(data)=>resolve(data))
  });
};



router.get('/', function(req, res) {
  // 모든 유저를 가져오는 코드...
  res.send('Users -> ',users);
});



module.exports = router // 새로 생겼어요!

path.join(__dirname, "./korea-covid19-api/index.js");
    const covid19Worker = pathDir("./korea-covid19-api/index.ts");
    const updateCovid19API = async () => {
      const covid19 = new Router("covid19");
      const wokrer_data: covid19API[] = await getData_from_Worker(
        covid19Worker
      );
      wokrer_data.map((covidData) => {
        covid19.createRouter(covidData.region,(req,res)=>{
          let covidInfo = covidData.data
          const from =req.query.from;
          const to =req.query.to;
          if(from!=undefined){
            covidInfo = covidInfo.filter((data)=>dateForm(data.date)>=Number(from))
          }
          if(to!=undefined){
            covidInfo = covidInfo.filter((data)=>dateForm(data.date)<=Number(to))
          }
          res.json(covidInfo)
        });
      });
      covid19.createIndexRouter();
    };
    setTimer_loop(ms2hour(1), updateCovid19API);
  }
};