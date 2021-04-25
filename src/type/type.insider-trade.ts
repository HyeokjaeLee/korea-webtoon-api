export interface OpenInsider {
  ticker: string;
  trade_date: string;
  company_name: string;
  insider_name: string;
  price: number;
  qty: number;
  owned: number;
  value: number;
}

export interface Stock {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose: number;
}

export interface YahooStock extends Omit<Stock, "date"> {
  date: number;
}

export interface Final {
  ticker: string;
  data: Stock[] | undefined;
}
