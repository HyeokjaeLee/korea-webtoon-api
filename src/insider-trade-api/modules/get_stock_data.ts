const yahooStockPrices = require("yahoo-stock-prices");
import type { A_stock_data } from "./types";
const error_ticker: string[] = [];

const get_a_data = async (ticker: string, start_date?: string, end_date?: string) => {
  try {
    const date_arr = (date_str: string) => {
      const date = new Date(date_str);
      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    };
    //날짜 안받을경우
    let start_date_arr;
    if (start_date != undefined) {
      start_date_arr = date_arr(start_date);
    } else {
      start_date_arr = { year: 0, month: 0, day: 0 };
    }
    let end_date_arr;
    if (end_date != undefined) {
      end_date_arr = date_arr(end_date);
    } else {
      end_date_arr = date_arr(String(new Date()));
    }
    const stock_original_data = await yahooStockPrices.getHistoricalPrices(
      start_date_arr.month,
      start_date_arr.day,
      start_date_arr.year,
      end_date_arr.month,
      end_date_arr.day,
      end_date_arr.year,
      ticker,
      "1d",
    );
    const stock_processed_data = stock_original_data
      .map((data: any) => {
        if (data.open != null && data.high != null && data.low != null && data.close != null) {
          const date = new Date("1970-1-1");
          date.setSeconds(date.getSeconds() + data.date);
          const result: A_stock_data = {
            date: date,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
          };
          return result;
        }
      })
      .filter((data: A_stock_data) => {
        return data !== undefined;
      });
    stock_processed_data.push(ticker);
    stock_processed_data.reverse();
    const data_length = stock_processed_data.length;
    if (stock_processed_data[data_length - 1] == ticker) {
      error_ticker.push(ticker);
    } else {
      return stock_processed_data;
    }
  } catch (e) {
    error_ticker.push(ticker);
  }
};

const get_stock_data = async (json_data: any, start_date?: string, end_date?: string) => {
  const ticker_arr = json_data.map((data: any) => data.ticker);
  const unique_ticker_arr = Array.from(new Set(ticker_arr));
  const dirty_stock_data = await Promise.all(
    unique_ticker_arr.map(async (data: any) => {
      return await get_a_data(data, start_date, end_date);
    }),
  );
  const clean_stock_data = dirty_stock_data.filter((data: A_stock_data) => {
    return data !== undefined;
  });
  return { stock_data: clean_stock_data, error_ticker: error_ticker };
};

export default get_stock_data;
