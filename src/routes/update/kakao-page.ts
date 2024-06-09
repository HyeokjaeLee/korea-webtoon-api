import { AppDataSource } from '../../database/datasource';
import { DataInfo, NormalizedWebtoon } from '../../database/entity';
import { getKakaoPageWebtoonList } from '../../modules/kakao-page';
import type { Response, Request } from 'express';

/**
 * @swagger
 * /update/kakao-page:
 *   put:
 *     tags:
 *       - DB Update
 *     summary: 카카오 웹툰 업데이트 정보를 최신화합니다. (6시간 이상 경과 시)
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
 *                   description: 웹툰 공급자
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
