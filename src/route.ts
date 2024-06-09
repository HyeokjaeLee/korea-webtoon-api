import express from 'express';
import { getKakaoPageWebtoonList } from './crawler/kakao-page';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
  getKakaoPageWebtoonList();
  res.send('Hello World!');
});
