import { AppDataSource } from '../../database/datasource';
import { DataInfo, NormalizedWebtoon } from '../../database/entity';
import { getKakaoPageWebtoonList } from '../../modules/kakao-page';
import type { Response, Request } from 'express';

export const putKakaoPage = async (_: Request, res: Response) => {
  const provider = 'KAKAO_PAGE';
  const dataInfoRepository = AppDataSource.getRepository(DataInfo);

  const kakaoPageDataInfo = await dataInfoRepository.findOneBy({
    provider,
  });

  const updateStartAt = kakaoPageDataInfo?.updateStartAt;

  const isOld = updateStartAt
    ? new Date().getTime() - updateStartAt.getTime() > 6 * 60 * 60 * 1000
    : true;

  if (!isOld) {
    if (!kakaoPageDataInfo) {
      return res.status(500);
    }

    const _updateStartAt = new Date(kakaoPageDataInfo.updateStartAt);

    return res.json({
      ...kakaoPageDataInfo,
      updateRunningTime: kakaoPageDataInfo.updateEndAt
        ? (kakaoPageDataInfo.updateEndAt.getTime() - _updateStartAt.getTime()) /
          60_000
        : (new Date().getTime() - _updateStartAt.getTime()) / 60_000,
    });
  }

  const newUpdateStartAt = new Date();

  await dataInfoRepository.save({
    provider,
    updateStartAt: newUpdateStartAt,
    updateEndAt: null,
  });

  const kakaoPageWebtoonList = await getKakaoPageWebtoonList();

  const webtoonRepository = AppDataSource.getRepository(NormalizedWebtoon);

  await webtoonRepository.save(kakaoPageWebtoonList);

  const result = {
    provider,
    updateStartAt: newUpdateStartAt,
    updateEndAt: new Date(),
  } as const;

  await dataInfoRepository.save(result);

  return res.json(result);
};
