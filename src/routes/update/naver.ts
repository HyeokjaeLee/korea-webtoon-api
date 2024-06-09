import { getNaverWebtoonList } from '../../modules/naver';
import { AppDataSource } from '../../database/datasource';
import { DataInfo, NormalizedWebtoon } from '../../database/entity';
import type { Response, Request } from 'express';

/**
 * @swagger
 * /update/naver:
 *   put:
 *     tags:
 *       - DB Update
 *     summary: 네이버 웹툰 업데이트 정보를 최신화합니다. (6시간 이상 경과 시)
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 provider:
 *                   type: string
 *                   enum: [KAKAO, NAVER, KAKAO_PAGE, RIDI]
 *                   example: NAVER
 *                   description: 웹툰 공급자
 *
 *                 updateStartAt:
 *                   type: string
 *                   format: date-time
 *                   description: API DB 업데이트 시작 날짜
 *                 updateEndAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: API DB 업데이트 종료 날짜 (업데이트 중일 경우 null)
 *                 updateRunningTime:
 *                   type: number
 *                   format: double
 *                   description: 업데이트 진행 시간 (분)
 *       500:
 *         description: Internal server error
 */
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

  return res.json({
    ...result,
    updateRunningTime:
      (result.updateEndAt.getTime() - result.updateStartAt.getTime()) / 60_000,
  });
};
