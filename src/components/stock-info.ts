const yahooStockPrices = require("yahoo-stock-prices");
import { isExists } from "./function/checking";
import {
  yahooStockInfo,
  stockInfo,
  TotalStockInfo,
} from "../interfaces/insider_trade";

class StockData {
  private newDate = new Date();
  private today = {
    year: this.newDate.getFullYear(),
    month: this.newDate.getMonth(),
    day: this.newDate.getDate(),
  };
  public errorTicker: string[] = [];
  private ticker_list: string[] = [];
  private get_a_yahooStockPrices = async (
    ticker: string
  ): Promise<yahooStockInfo[]> => {
    const test = await yahooStockPrices.getHistoricalPrices(
      0,
      0,
      0,
      this.today.month,
      this.today.day,
      this.today.year,
      ticker,
      "1d"
    );
    return test;
  };

  private seconds2dateForm = (seconds: number): Date => {
    const calcuBaseDate = "1970-1-1";
    const date = new Date(calcuBaseDate);
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  };

  private filter_stockPrices = async (yahooStockPrices: yahooStockInfo[]) => {
    const filteredStockPrices: stockInfo[] = [];
    yahooStockPrices.forEach((data: yahooStockInfo) => {
      if (isExists(data.close)) {
        const date = this.seconds2dateForm(data.date);
        filteredStockPrices.push({
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
    return filteredStockPrices;
  };
  constructor(ticker_list: string[]) {
    this.ticker_list = ticker_list;
  }

  public stockInfo = async () => {
    const test = this.ticker_list.map((ticker) => {
      return this.get_a_yahooStockPrices(ticker);
    });
    await Promise.all(test);
    const test2: any = [];
    test.forEach(() => {});
    return test;
  }; /*
    const totalStockData = this.ticker_list.map(async (ticker) => {
      const stockPrices = await this.filter_stockPrices(
          await this.get_a_yahooStockPrices(ticker)
        ),
        stockData = { ticker: ticker, data: stockPrices };
      console.log(stockData);
      if (isExists(stockData)) return stockData;
    });
    console.log(totalStockData);
    return totalStockData;
  };*/
}

const test = async () => {
  const test = new StockData(["LOV", "JOL", "CL", "TEST"]); //
  const test2 = await test.stockInfo();
  console.log(test2);
};

test();
