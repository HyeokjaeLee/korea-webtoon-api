import { getTotalStockInfo } from "../insider-trade-api/modules/get_stock_data";

//insierTrade
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
  
  export interface yahooStockInfo {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjclose: number;
  }
  
  export interface stockInfo {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjclose: number;
  }
  
  //Webtoon
  export interface A_webtoon_info {
    title: string;
    artist: string;
    url: string;
    img: string|undefined;
    service: string;
    state: string;
    weekday: number;
  }

  //Covid19
  interface confirmed {
    infected: detail;
    recovered: detail;
    death: detail;
    total: number;
  }
  interface detail {
    new: number | infected;
    existing: number;
    total: number;
  }
  
  interface infected {
    local: number;
    overseas: number;
    total: number;
  }
  export interface covid19Info {
    date: string | Date;
    confirmed: confirmed;
  }
  
  export interface regionList {
    kor: string;
    eng: string;
  }
  
  export interface covid19API {
    region: string;
    data: covid19Info[];
  }
  
  export interface covid19OriginalInfo {
    date: Date;
    infected: number;
    new_local_infection: number;
    new_overseas_infection: number;
    new_infected: number;
    death: number;
    recovered: number;
    confirmed: number;
  }
  
  export interface TotalStockInfo {
    ticker:string,
    data:stockInfo[]|undefined
  }