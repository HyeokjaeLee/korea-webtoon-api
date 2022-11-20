import axios from 'axios';

const query = `
query contentHomeOverview($seriesId: Long!) {
    contentHomeOverview(seriesId: $seriesId) {
      content {
        authors
      }
    }
  }  
`;

const url = 'https://page.kakao.com/graphql';

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
  const { data } = await axios<RequestResult>(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    url,
    data: {
      query,
      variables: {
        seriesId,
      },
    },
  });

  return data.data.contentHomeOverview.content.authors;
};
