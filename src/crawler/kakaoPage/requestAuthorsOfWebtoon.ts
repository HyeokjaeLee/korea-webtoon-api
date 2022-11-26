import axios from 'axios';
import { consoleWithTime } from 'utils';
import { KAKAO_PAGE_API_URL } from '.';

const QUERY = `
query contentHomeOverview($seriesId: Long!) {
    contentHomeOverview(seriesId: $seriesId) {
      content {
        authors
      }
    }
  }  
`;

interface RequestResult {
  data: {
    contentHomeOverview: {
      content: {
        authors: string;
      };
    };
  };
}

export const requestAuthorsOfWebtoon = async (
  seriesId: string,
  errorCount = 0,
) => {
  try {
    const { data } = await axios<RequestResult>({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      url: KAKAO_PAGE_API_URL,
      data: {
        query: QUERY,
        variables: {
          seriesId: Number(seriesId),
        },
      },
    });
    return data.data.contentHomeOverview.content.authors;
  } catch {
    errorCount++;
    const errorMessage = `카카오 페이지 웹툰 seriesId:${seriesId} authors 요청 실패`;
    consoleWithTime(`${errorMessage}, ${errorCount}번째 재시도`);
    if (errorCount > 10) {
      throw new Error(errorMessage);
    }
    return requestAuthorsOfWebtoon(seriesId, errorCount);
  }
};
