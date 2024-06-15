import axios from 'axios';
import axiosRetry from 'axios-retry';

const kakaoApi = axios.create({
  baseURL: 'https://gateway-kw.kakao.com/section/v2/timetables',
});

axiosRetry(kakaoApi, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 3_000,
});

export enum KAKAO_PAGE_PLACEMENT {
  COMPLETE = 'timetable_completed',
  MON = 'timetable_mon',
  TUE = 'timetable_tue',
  WED = 'timetable_wed',
  THU = 'timetable_thu',
  FRI = 'timetable_fri',
  SAT = 'timetable_sat',
  SUN = 'timetable_sun',
}

interface KakaoWebtoonCard {
  content: {
    id: string;
    //! 실제 웹툰 페이지 URL에 쓰임
    seoId: string;
    title: string;
    badges: {
      title: 'FREE_PUBLISHING' | 'WAIT_FOR_FREE_PLUS';
      type: 'INFO';
    }[];
    adult: boolean;
    authors: {
      name: string;
      type: 'AUTHOR' | 'ILLUSTRATOR' | 'PUBLISHER';
    }[];

    featuredCharacterImageA: string;
    featuredCharacterImageB: string;
    backgroundImage: string;
  };
}

interface GetWebtoonListByPlacementResponse {
  data: [
    {
      cardGroups: [
        {
          cards: KakaoWebtoonCard[];
        },
      ];
    },
  ];
}

export const getWebtoonListByPlacement = (placement: KAKAO_PAGE_PLACEMENT) =>
  kakaoApi.get<GetWebtoonListByPlacementResponse>(
    `/days?placement=${placement}`,
  );

//https://gateway-kw.kakao.com/section/v2/timetables/days?placement=timetable_completed

//https://gateway-kw.kakao.com/section/v2/timetables/days?placement=timetable_tue
