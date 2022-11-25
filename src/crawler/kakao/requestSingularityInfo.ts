import axios from 'axios';
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

export const requestSingularityInfo = async (
  webtoonId: number,
  errorCount = 0,
) => {
  try {
    const res: SingularityInfoResponse = await axios.get(
      AVAILABLE_TICKETS_API_URL + webtoonId,
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
    console.log('try again request Kakao singularity info', errorCount);
    if (errorCount > 10) {
      throw new Error('can not request kakao singularity info');
    }
    return requestSingularityInfo(webtoonId, errorCount);
  }
};
