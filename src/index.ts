import express from 'express';
import { getKakaoPageWebtoonList } from './modules/kakao-page';
import { DataInfo, NormalizedWebtoon } from './database/entity';
import { getNaverWebtoonList } from './modules/naver';
import { AppDataSource } from './database/datasource';
import { putKakaoPage } from './routes/update/kakao-page';
import { putNaver } from './routes/update/naver';
const app = express();
const PORT = 3000;

(async () => {
  await AppDataSource.initialize();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  app.put('/update/kakao-page', putKakaoPage);

  app.put('/update/naver', putNaver);
})();
