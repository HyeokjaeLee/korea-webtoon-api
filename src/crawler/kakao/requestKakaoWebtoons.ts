import axios from 'axios';
import { consoleWithTime } from 'utils';

const KAKAO_API_URL = 'https://gateway-kw.kakao.com/section/v1';

export interface KakaoWebtoon {
  id: string;
  key: string;
  content: {
    /**SEO ID */
    seoId: string;
    /**웹툰 제목 */
    title: string;
    /**나이 제한 */
    ageLimit: number;
    /**웹툰 고유 ID */
    id: number;
    /**썸네일 */
    featuredCharacterImageA: string;
    ipPromotionVideo: {
      /**프로모션 영상 */
      horizontalVideo: string;
    };
    authors: {
      name: string;
      type: 'AUTHOR' | 'ILLUSTRATOR' | 'PUBLISHER';
      order: number;
    }[];
  };
  additional: {
    /**신작 여부 */
    new: boolean;
    /**휴재 여부 */
    rest: boolean;
    /**업데이트 여부 */
    up: boolean;
  };
}

interface KakaoWebtoonResponse {
  id: string;
  title: string;
  module: string;
  cardGroups: [
    {
      cards: KakaoWebtoon[];
    },
  ];
}

export const requestKakaoWebtoons = async (
  path: string,
  hasSections?: boolean,
  errorCount = 0,
): Promise<KakaoWebtoonResponse[]> => {
  try {
    const res = await axios.get(KAKAO_API_URL + path);

    const { data } = res.data;

    return hasSections ? data.sections : data;
  } catch {
    errorCount++;
    const errorMessage = `카카오 웹툰 path:${path} 요청 실패`;
    consoleWithTime(`${errorMessage}, ${errorCount}번째 재시도`);
    if (errorCount > 10) {
      throw new Error(errorMessage);
    }
    return requestKakaoWebtoons(path, hasSections, errorCount);
  }
};
