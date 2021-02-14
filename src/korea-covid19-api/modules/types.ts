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
