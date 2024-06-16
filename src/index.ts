import express from 'express';
import { AppDataSource } from './database/datasource';
import { putKakaoPage } from './routes/update/kakao-page';
import { putNaver } from './routes/update/naver';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import { putKakao } from './routes/update/kakao';

const app = express();
const PORT = 3000;

(async () => {
  await AppDataSource.initialize();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.put('/update/kakao-page', putKakaoPage);

  app.put('/update/naver', putNaver);

  app.put('/update/kakao', putKakao);
})();
