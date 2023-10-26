enum WEBTOON_PLATFORM {
  NAVER = 'naver',
  KAKAO = 'kakao',
}

export enum WEBTOON_UPDATE_DAY {
  SUN = 'sun',
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  FINISHED = 'finished',
  NAVER_DAILY_PLUS = 'naver-daily-plus',
}

interface WebtoonData {
  title: string;
  ahthor: string;
  url: string;
  img: string;
  updateDays: WEBTOON_UPDATE_DAY[];
  platform: WEBTOON_PLATFORM;
  fanCount: number | null;
  isNew: boolean;
  isRest: boolean;
  isUpdated: boolean;
  isOver15: boolean;
  isOver19: boolean;
  isFree: boolean;
  isWaitFree: boolean;
}

export interface Webtoon {
  id: number;
  combinationKey: string;
  data: {
    isNew: boolean;
    isRest: boolean;
    isUpdated: boolean;
    is;
  };
}
