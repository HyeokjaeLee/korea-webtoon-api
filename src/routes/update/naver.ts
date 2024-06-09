import { getNaverWebtoonList } from '../../modules/naver';
import { AppDataSource } from '../../database/datasource';
import { DataInfo, NormalizedWebtoon } from '../../database/entity';
import type { Response, Request } from 'express';

export const putNaver = async (_: Request, res: Response) => {
  const provider = 'NAVER';
  const dataInfoRepository = AppDataSource.getRepository(DataInfo);

  const naverDataInfo = await dataInfoRepository.findOneBy({
    provider,
  });

  const updateStartAt = naverDataInfo?.updateStartAt;

  const isOld = updateStartAt
    ? new Date().getTime() - updateStartAt.getTime() > 6 * 60 * 60 * 1000
    : true;

  if (!isOld) {
    if (!naverDataInfo) {
      return res.status(500);
    }

    const _updateStartAt = new Date(naverDataInfo.updateStartAt);

    return res.json({
      ...naverDataInfo,
      updateRunningTime: naverDataInfo.updateEndAt
        ? (naverDataInfo.updateEndAt.getTime() - _updateStartAt.getTime()) /
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

  const naverPageWebtoonList = await getNaverWebtoonList();

  const webtoonRepository = AppDataSource.getRepository(NormalizedWebtoon);

  await webtoonRepository.save(naverPageWebtoonList);

  const result = {
    provider,
    updateStartAt: newUpdateStartAt,
    updateEndAt: new Date(),
  } as const;

  await dataInfoRepository.save(result);

  return res.json(result);
};
