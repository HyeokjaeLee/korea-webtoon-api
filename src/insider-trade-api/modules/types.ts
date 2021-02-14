export interface A_trade_data {
  ticker: string;
  trade_date: Date;
  company_name: string;
  insider_name: string;
  price: number;
  qty: number;
  owned: number;
  value: number;
}

export interface A_stock_data {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}
