import { Injectable } from '@nestjs/common';
import naver_crawler from './function/naver-crawler';
import kakao_crawler from './function/kakao-crawler';
import { Webtoon } from './types/webtoon';
import * as fs from 'fs';

interface PlatformObject {
  weekdayWebtoon: Webtoon[][];
  finishedWebtoon: Webtoon[];
}

let naver: PlatformObject = {
  weekdayWebtoon: JSON.parse(
    fs.readFileSync('data/naver-weekday-webtoon.json', 'utf8'),
  ),
  finishedWebtoon: JSON.parse(
    fs.readFileSync('data/naver-finished-webtoon.json', 'utf8'),
  ),
};

let kakao: PlatformObject = {
  weekdayWebtoon: JSON.parse(
    fs.readFileSync('data/kakao-weekday-webtoon.json', 'utf8'),
  ),
  finishedWebtoon: JSON.parse(
    fs.readFileSync('data/kakao-finished-webtoon.json', 'utf8'),
  ),
};

const combineWeekdayWebtoon = (weekdayWebtoon: Webtoon[][]) => [
  ...weekdayWebtoon[0],
  ...weekdayWebtoon[1],
  ...weekdayWebtoon[2],
  ...weekdayWebtoon[3],
  ...weekdayWebtoon[4],
  ...weekdayWebtoon[5],
  ...weekdayWebtoon[6],
];

(async () => {
  console.log('first update');
  naver = await naver_crawler();
  kakao = await kakao_crawler();
})();

setInterval(async () => {
  console.log('update');
  naver = await naver_crawler();
  kakao = await kakao_crawler();
}, 3600000);

@Injectable()
export class AppService {
  kakaoFinishedWebtoon() {
    return kakao.finishedWebtoon;
  }
  kakaoWeeklyWebtoon() {
    return combineWeekdayWebtoon(kakao.weekdayWebtoon);
  }
  kakaoWebtoon() {
    return this.kakaoWeeklyWebtoon().concat(this.kakaoFinishedWebtoon());
  }
  naverFinishedWebtoon() {
    return naver.finishedWebtoon;
  }
  naverWeeklyWebtoon() {
    return combineWeekdayWebtoon(naver.weekdayWebtoon);
  }
  naverWebtoon() {
    return this.naverWeeklyWebtoon().concat(this.naverFinishedWebtoon());
  }
  webtoon() {
    return this.kakaoWebtoon().concat(this.naverWebtoon());
  }
}
