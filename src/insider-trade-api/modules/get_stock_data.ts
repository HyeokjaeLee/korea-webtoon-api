const yahooStockPrices = require("yahoo-stock-prices");
import type { yahooStockInfo, stockInfo,A_trade_data,TotalStockInfo } from "../../modules/types";
import { checkEmpty } from "../../modules/checking";
const errorTicker: string[] = [];

//string 날짜를 number 형식으로 분리 ex: "20020123" => [2020,01,23]
const separateStrDate = (date_str: string) => {
  const date = new Date(date_str);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

//기준일로 부터 seconds초 후 Date return
const seconds2dateForm = (seconds: number): Date => {
  const calcuBaseDate = "1970-1-1";
  const date = new Date(calcuBaseDate);
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

//get 한가지 주식의 정보
const getAstockInfo = async (ticker: string, start_date?: string, end_date?: string) => {
  try {
    //받아올 날짜의 시작일을 입력안한경우
    let start_date_arr;
    if (start_date != undefined) {
      start_date_arr = separateStrDate(start_date);
    } else {
      start_date_arr = { year: 0, month: 0, day: 0 };
    }

    //받아올 날짜의 종료일을 입력안한경우
    let end_date_arr;
    if (end_date != undefined) {
      end_date_arr = separateStrDate(end_date);
    } else {
      end_date_arr = separateStrDate(String(new Date()));
    }

    //yahooStockPrices모듈을 통해 받아온 주식정보
    const yahooStockPricesInfo: yahooStockInfo[] = await yahooStockPrices.getHistoricalPrices(
      start_date_arr.month,
      start_date_arr.day,
      start_date_arr.year,
      end_date_arr.month,
      end_date_arr.day,
      end_date_arr.year,
      ticker,
      "1d",
    );

    //주식정보 정리(빈값 삭제,날짜형식 변환,시간순서대로 재배치)
    const filtered_yahooStockPricesInfo = (() => {
      const result: stockInfo[] = [];
      yahooStockPricesInfo.map((data: yahooStockInfo) => {
        //빈값 확인
        if (
          checkEmpty(data.date) &&
          checkEmpty(data.open) &&
          checkEmpty(data.high) &&
          checkEmpty(data.low) &&
          checkEmpty(data.close) &&
          checkEmpty(data.adjclose) &&
          checkEmpty(data.volume)
        ) {
          //초단위로 계산되었던 날짜 정보를 Date타입으로 변경
          const date = seconds2dateForm(data.date);
          result.push({
            date: date,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume,
            adjclose: data.adjclose,
          });
        }
      });
      //역순으로 재배치
      result.reverse();
      return result;
    })();

    return filtered_yahooStockPricesInfo;
  } catch (e) {
    errorTicker.push(ticker);
  }
};

//get 전체 주식정보
export const getTotalStockInfo = async (json_data: A_trade_data[], start_date?: string, end_date?: string) => {
  const tickerArr = json_data.map((data) => data.ticker);
  const unique_tickerArr = Array.from(new Set(tickerArr));
  const totalStockInfo = await (async () => {
    const result: TotalStockInfo[] = [];
    await Promise.all(
      unique_tickerArr.map(async (ticker) => {
        const aStockInfo = await getAstockInfo(ticker, start_date, end_date);
        if (checkEmpty(aStockInfo)) {
          result.push({
            ticker: ticker,
            data: aStockInfo,
          });
        } else {
          errorTicker.push(ticker);
        }
      }),
    );
    return result;
  })();
  return { stockData: totalStockInfo, errorTicker: errorTicker };
};
