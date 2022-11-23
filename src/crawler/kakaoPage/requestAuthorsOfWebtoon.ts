import axios from 'axios';
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
    console.log('try again requestAuthorsOfWebtoon', errorCount);
    if (errorCount > 10) {
      throw new Error('can not request kakao page authors');
    }
    return requestAuthorsOfWebtoon(seriesId, errorCount);
  }
};
