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
  date: Date;
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
