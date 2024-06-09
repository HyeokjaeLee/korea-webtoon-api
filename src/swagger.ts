import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    tags: [
      {
        name: 'DB Update',
        description: '웹툰 정보 최신화 관련 API',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
