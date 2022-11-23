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

export const requestAuthorsOfWebtoon = async (seriesId: string) => {
  const { data } = await axios<RequestResult>({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    url: KAKAO_PAGE_API_URL,
    data: {
      QUERY,
      variables: {
        seriesId,
      },
    },
  });

  return data.data.contentHomeOverview.content.authors;
};
