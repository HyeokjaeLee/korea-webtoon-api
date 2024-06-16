import type { Response, Request } from 'express';

import { DataInfo } from '@/database/entity';
import { DOMAIN, ROUTES } from '@/constants';
import axios from 'axios';

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: 웹툰 업데이트 상태를 확인합니다.
 *     tags: [Health status]
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataInfo'
 *       500:
 *         description: Internal server error
 */
export const getHealthCheck = async (_: Request, res: Response) => {
  const updateResponse = await Promise.all(
    [ROUTES.UPDATE_NAVER, ROUTES.UPDATE_KAKAO, ROUTES.UPDATE_KAKAO_PAGE].map(
      (updateRoute) => axios.put<DataInfo>(`${DOMAIN}${updateRoute}`),
    ),
  );

  return res.json(updateResponse.map(({ data }) => data));
};
