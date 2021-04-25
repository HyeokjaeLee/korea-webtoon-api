interface Confirmed {
  infected: Detail;
  recovered: Detail;
  death: Detail;
  total: number;
}
interface Detail {
  new: number | Infected;
  existing: number;
  total: number;
}

interface Infected {
  local: number;
  overseas: number;
  total: number;
}
export interface TotalData {
  date: Date;
  confirmed: Confirmed;
}

export interface RegionList {
  kor: string;
  eng: string;
}

export interface Final {
  region: string;
  data: TotalData[];
}

export interface OriginalAPI {
  date: Date;
  infected: number;
  new_local_infection: number;
  new_overseas_infection: number;
  new_infected: number;
  death: number;
  recovered: number;
  confirmed: number;
}
