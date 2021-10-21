import { Injectable } from '@nestjs/common';
import { naver_crawler } from './function/naver-crawler';
import { kakao_crawler } from './function/kakao-crawler';
import { Webtoon } from './types/webtoon';
import * as fs from 'fs';

interface PlatformObject {
  weeklyWebtoonData: Webtoon[];
  finishedWebtoonData: Webtoon[];
}

let naver: PlatformObject = {
  weeklyWebtoonData: JSON.parse(
    fs.readFileSync('data/naver-weekly-webtoon.json', 'utf8'),
  ),
  finishedWebtoonData: JSON.parse(
    fs.readFileSync('data/naver-finished-webtoon.json', 'utf8'),
  ),
};

let kakao: PlatformObject = {
  weeklyWebtoonData: JSON.parse(
    fs.readFileSync('data/kakao-weekly-webtoon.json', 'utf8'),
  ),
  finishedWebtoonData: JSON.parse(
    fs.readFileSync('data/kakao-finished-webtoon.json', 'utf8'),
  ),
};

setTimeout(async () => {
  console.log('first update');
  naver = await naver_crawler();
  kakao = await kakao_crawler();
}, 60000);

setInterval(async () => {
  console.log('update');
  naver = await naver_crawler();
  kakao = await kakao_crawler();
}, 43200000);

@Injectable()
export class AppService {
  webtoon() {
    return [
      ...naver.weeklyWebtoonData,
      ...naver.finishedWebtoonData,
      ...kakao.weeklyWebtoonData,
      ...kakao.finishedWebtoonData,
    ];
  }
  kakaoWebtoon() {
    return [...kakao.weeklyWebtoonData, ...kakao.finishedWebtoonData];
  }
  kakaoWeeklyWebtoon() {
    return kakao.weeklyWebtoonData;
  }
  kakaoFinishedWebtoon() {
    return kakao.finishedWebtoonData;
  }
  naverWebtoon() {
    return [...naver.weeklyWebtoonData, ...naver.finishedWebtoonData];
  }
  naverWeeklyWebtoon() {
    return naver.weeklyWebtoonData;
  }
  naverFinishedWebtoon() {
    return naver.finishedWebtoonData;
  }
}
