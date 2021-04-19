const yahooStockPrices = require("yahoo-stock-prices");
import { checkEmpty } from "./function/checking";
import { yahooStockInfo } from "../interfaces/insider_trade";

class StockData {
  private newDate = new Date();
  private today = {
    year: this.newDate.getFullYear(),
    month: this.newDate.getMonth(),
    day: this.newDate.getDate(),
  };
  public errorTicker: string[] = [];
  private ticker_list: string[] = [];
  private get_a_yahooStockPrices = async (ticker: string) =>
    await yahooStockPrices.getHistoricalPrices(
      0,
      0,
      0,
      this.today.month,
      this.today.day,
      this.today.year,
      ticker,
      "1d"
    );
  private seconds2dateForm = (seconds: number): Date => {
    const calcuBaseDate = "1970-1-1";
    const date = new Date(calcuBaseDate);
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  };
  private filter_stockPrices = (yahooStockPrices: yahooStockInfo[]) =>
    yahooStockPrices
      .map((data: yahooStockInfo) => {
        if (
          checkEmpty(data.date) &&
          checkEmpty(data.open) &&
          checkEmpty(data.high) &&
          checkEmpty(data.low) &&
          checkEmpty(data.close) &&
          checkEmpty(data.adjclose) &&
          checkEmpty(data.volume)
        ) {
          const date = this.seconds2dateForm(data.date);
          return {
            date: date,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume,
            adjclose: data.adjclose,
          };
        }
      })
      .reverse();
  constructor(ticker_list: string[]) {
    this.ticker_list = ticker_list;
  }
  public get_total_info = () =>
    this.ticker_list.map(async (ticker) => {
      try {
        return this.filter_stockPrices(
          await this.get_a_yahooStockPrices(ticker)
        );
      } catch (e) {
        this.errorTicker.push(ticker);
      }
    });
}

const test = new StockData([""]);
