const yahooStockPrices = require("yahoo-stock-prices");
import { isExists } from "../function/checking";
import * as InsiderTrade from "../type/type.insider-trade";

export class Stock {
  constructor(ticker_list: string[]) {
    this.ticker_list = ticker_list;
  }

  private newDate = new Date();
  private today = {
    year: this.newDate.getFullYear(),
    month: this.newDate.getMonth(),
    day: this.newDate.getDate(),
  };
  private ticker_list: string[] = [];
  public errorTicker: string[] = [];
  private getStockPrices = async (ticker: string) => {
    try {
      const stockPrices = this.filter_stockPrices(
        await yahooStockPrices.getHistoricalPrices(
          0,
          0,
          0,
          this.today.month,
          this.today.day,
          this.today.year,
          ticker,
          "1d"
        )
      );
      if (stockPrices.length != 0) {
        return { ticker: ticker, data: stockPrices };
      } else this.errorTicker.push(ticker);
    } catch (e) {
      this.errorTicker.push(ticker);
    }
  };

  private filter_stockPrices = (
    yahooStockPrices: InsiderTrade.YahooStock[]
  ) => {
    const filteredStockPrices: InsiderTrade.Stock[] = [];
    yahooStockPrices.forEach((data) => {
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

  private seconds2dateForm = (seconds: number): Date => {
    const calcuBaseDate = "1970-1-1";
    const date = new Date(calcuBaseDate);
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  };

  public get_stock_data = async () => {
    const stockDataArray = this.ticker_list.map((ticker) =>
      this.getStockPrices(ticker)
    );
    await Promise.all(stockDataArray); //병렬처리를 위해 사용
    const final_stockDataArray: InsiderTrade.Final[] = [];
    stockDataArray.forEach((_stockData) => {
      _stockData.then((_stockData) => {
        if (_stockData != undefined) {
          final_stockDataArray.push({
            ticker: _stockData.ticker,
            data: _stockData.data,
          });
        }
      });
    });
    return final_stockDataArray;
  };
}

const test = async () => {
  const test = new Stock(["MYF", "JOL", "CL", "TEST"]); //
  const test2 = await test.get_stock_data();
  console.log(test2);
};
