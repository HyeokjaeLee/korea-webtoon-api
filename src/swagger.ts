import swaggerJsdoc from 'swagger-jsdoc';
import { DOMAIN } from './constants';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: DOMAIN,
      },
    ],
    tags: [
      {
        name: 'DB Update',
        description: '웹툰 정보 최신화 관련 API',
      },
      {
        name: 'Health status',
        description: '웹툰 정보 최신화 상태 확인 관련 API',
      },
      {
        name: 'Webtoons',
        description: '웹툰 정보 조회 관련 API',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/schemas/**/*.yaml'],
};

export const specs = swaggerJsdoc(options);
