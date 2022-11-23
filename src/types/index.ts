export enum WebtoonWeek {
  SUN = 0,
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
  FINISH = 7,
}

export type Singularity = 'over-15' | 'free' | 'wait-free';

export interface Webtoon {
  title: string;
  author: string;
  url: string;
  img: string;
  service: 'kakao' | 'naver' | 'kakao-page';
  week: number;
  fanCount: number | null;
  additional: {
    new: boolean;
    rest: boolean;
    up: boolean;
    adult: boolean;
    singularityList: Singularity[];
  };
}
