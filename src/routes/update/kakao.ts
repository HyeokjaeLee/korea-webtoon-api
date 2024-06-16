import { getKakaoWebtoonList } from '@/modules/kakao';
import { createUpdateMethod } from './functions/createUpdateMethod';

/**
 * @swagger
 * /update/kakao:
 *   put:
 *     tags: [DB Update]
 *     summary: 카카오 웹툰 업데이트 정보를 최신화합니다. (6시간 이상 경과 시)
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DataInfo'
 *       500:
 *         description: Internal server error
 */
export const putKakao = createUpdateMethod({
  provider: 'KAKAO',
  webtoonCrawler: getKakaoWebtoonList,
});
