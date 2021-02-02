interface A_trade_data {
  ticker: string;
  trade_date: Date;
  company_name: string;
  insider_name: string;
  price: number;
  qty: number;
  owned: number;
  value: number;
}

interface A_stock_data {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const $2num = (string_data: string) => {
  return Number(string_data.replace("$", "").replace(/,/gi, ""));
};

export { $2num };
export type { A_trade_data, A_stock_data };
