import axios from 'axios';
import { consoleWithTime } from 'utils';
import { Singularity } from '../../types';

const AVAILABLE_TICKETS_API_URL =
  'https://gateway-kw.kakao.com/ticket/v2/views/content-home/available-tickets?contentId=';

interface SingularityInfoResponse {
  data: {
    data: {
      ticketCount: number;
      welcomeGiftTicketCount: number;
      freeEpisodeCount: number;
      allFree: boolean;
      waitForFree?: {
        interval: string;
        excludeEpisodeCount: number;
        started: boolean;
        charged: boolean;
        responseDateTime: string;
      };
    };
  };
}

export const requestSingularityInfo = async (id: number, errorCount = 0) => {
  try {
    const res: SingularityInfoResponse = await axios.get(
      AVAILABLE_TICKETS_API_URL + id,
      {
        headers: {
          'accept-language': 'ko',
        },
      },
    );

    const { data } = res.data;

    if (data.allFree) {
      return [Singularity.FREE];
    }

    if (data.waitForFree) {
      return [Singularity.WAIT_FREE];
    }
  } catch {
    errorCount++;
    const errorMessage = `카카오 웹툰 id:${id} singularity 요청 실패`;
    consoleWithTime(`${errorMessage}, ${errorCount}번째 재시도`);
    if (errorCount > 10) {
      throw new Error(errorMessage);
    }
    return requestSingularityInfo(id, errorCount);
  }
};
