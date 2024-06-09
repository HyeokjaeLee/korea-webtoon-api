declare type UpdateWeek = '월' | '화' | '수' | '목' | '금' | '토' | '일';

declare interface NormalizedWebtoon {
  id: string;
  title: string;
  provider: 'KAKAO' | 'NAVER' | 'KAKAO_PAGE' | 'RIDI';
  updateWeek: UpdateWeek[] | null;
  url: string;
  thumbnail: string;
  isEnd: boolean;
  isFree: boolean;
  isUpdated: boolean;
  ageGrade: number;
  thumbnail: string;
  freeWaitHour: number | null;
  authors: string[];
}
