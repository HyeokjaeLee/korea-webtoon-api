import { requestWebtoonsByDayTabUid } from './requestWebtoonsByDayTabUid';
import { DayTabUid } from './requestKakaoPageWebtoons';
import { requestAuthorsOfWebtoon } from './requestAuthorsOfWebtoon';
import { standardizeKakaoPageWebtoons } from './standardizeKakaoPageWebtoons';
import { Week, Webtoon } from '../../types';

const getKakaoPageWebtoons = async () => {
  const webtoons: Webtoon[] = [];

  const dayTabLabels = Object.values(DayTabUid).filter(
    (value) => typeof value === 'string',
  );

  for (const dayTabLabel of dayTabLabels) {
    const kakaoPageWebtoonsOfDay = await requestWebtoonsByDayTabUid(
      DayTabUid[dayTabLabel],
    );

    for (const kakaoPageWebtoon of kakaoPageWebtoonsOfDay) {
      const author = await requestAuthorsOfWebtoon(
        kakaoPageWebtoon.eventLog.eventMeta.id,
      );

      const webtoon = standardizeKakaoPageWebtoons(
        kakaoPageWebtoon,
        author,
        Week[dayTabLabel],
      );

      webtoons.push(webtoon);
    }
  }
  return webtoons;
};

getKakaoPageWebtoons();
