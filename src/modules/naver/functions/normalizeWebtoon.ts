import { NaverWebtoonTitle } from './naverApi';
import type { NormalizedWebtoon } from '@/database/entity';

export const normalizeWebtoon = ({
  titleId,
  ...webtoon
}: NaverWebtoonTitle): Omit<NormalizedWebtoon, 'updateDays'> => ({
  title: webtoon.titleName,
  ageGrade: webtoon.adult ? 19 : 0,
  //! '/' 또는 ' / '로 구분된 작가명을 배열로 변환
  authors: webtoon.author.split(/ \/ |\/| \/ /),
  isEnd: webtoon.finish,
  freeWaitHour: webtoon.bm ? 24 : null,
  isFree: true,
  id: `naver_${titleId}`,
  provider: 'NAVER',
  thumbnail: [webtoon.thumbnailUrl],
  isUpdated: webtoon.up,
  url: `https://comic.naver.com/webtoon/list?titleId=${titleId}`,
});
