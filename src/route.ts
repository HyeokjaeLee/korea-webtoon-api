import express from 'express';
import { getKakaoPageWebtoonList } from './modules/kakao-page';
import { getNaverWebtoonList } from './modules/naver';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
  getNaverWebtoonList();
  res.send('Hello World!');
});
