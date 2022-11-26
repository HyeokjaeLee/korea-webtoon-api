import { requestKakaoWebtoons, KakaoWebtoon } from './requestKakaoWebtoons';
import { requestFanCount } from './requestFanCount';
import { requestSingularityInfo } from './requestSingularityInfo';
import { standardizeKakaoWebtoon } from './standardizeKakaoWebtoon';
import { UpdateDay, Webtoon } from '../../types';

export const getFinishedKakaoWebtoons = async (
  originalType: 'novel' | 'general',
) => {
  const [finishedWebtoons] = await requestKakaoWebtoons(
      `/sections?placement=${
        originalType === 'novel' ? 'novel' : 'channel'
      }_completed`,
    ),
    kakaoWebtoons = finishedWebtoons.cardGroups[0].cards;

  const webtoons: Webtoon[] = [];

  //! 비동기적으로 요청시 카카오측 서버에서 요청을 막음
  for (const kakaoWebtoon of kakaoWebtoons) {
    const { id } = kakaoWebtoon.content;

    const [fanCount, singularityInfo] = await Promise.all([
      requestFanCount(id),
      requestSingularityInfo(id),
    ]);

    webtoons.push(
      standardizeKakaoWebtoon(
        kakaoWebtoon,
        [UpdateDay.FINISHED],
        fanCount,
        singularityInfo,
      ),
    );
  }

  return webtoons;
};
