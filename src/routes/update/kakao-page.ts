import { getKakaoPageWebtoonList } from '@/modules/kakao-page';
import { createUpdateMethod } from './functions/createUpdateMethod';

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
 *                   example: KAKAO_PAGE
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
export const putKakaoPage = createUpdateMethod({
  provider: 'KAKAO_PAGE',
  webtoonCrawler: getKakaoPageWebtoonList,
});
