import { getNaverWebtoonList } from '@/modules/naver';
import { createUpdateMethod } from './functions/createUpdateMethod';

/**
 * @swagger
 * /update/naver:
 *   put:
 *     tags: [DB Update]
 *     summary: 네이버 웹툰 업데이트 정보를 최신화합니다. (6시간 이상 경과 시)
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
export const putNaver = createUpdateMethod({
  provider: 'NAVER',
  webtoonCrawler: getNaverWebtoonList,
});
