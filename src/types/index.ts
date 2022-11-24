export enum UpdateDay {
  SUN = 'sun',
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  FINISHED = 'finished',
  NAVER_DAILY = 'naverDaily',
}

export enum Singularity {
  OVER_15 = 'over15',
  FREE = 'free',
  WAIT_FREE = 'waitFree',
}

export interface Webtoon {
  title: string;
  author: string;
  url: string;
  img: string;
  service: 'kakao' | 'naver' | 'kakao-page';
  updateDays: UpdateDay[];
  fanCount: number | null;
  additional: {
    new: boolean;
    rest: boolean;
    up: boolean;
    adult: boolean;
    singularityList: Singularity[];
  };
}
