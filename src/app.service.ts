import { Injectable } from '@nestjs/common';
import naver_crawler from './function/naver-crawler';
import kakao_crawler from './function/kakao-crawler';
import kakaoPage_crawler from './function/kakaoPage-crawler';
import { Webtoon } from './types/webtoon';
import * as fs from 'fs';
interface PlatformObject {
  weekdayWebtoon: Webtoon[][];
  finishedWebtoon: Webtoon[];
}

@Injectable()
export class AppService {
  kakao: PlatformObject;
  naver: PlatformObject;
  kakaoPage: PlatformObject;
  constructor() {
    this.naver = JSON.parse(fs.readFileSync('data/naver.json', 'utf8'));
    this.kakao = JSON.parse(fs.readFileSync('data/kakao.json', 'utf8'));
    this.kakaoPage = JSON.parse(fs.readFileSync('data/kakaoPage.json', 'utf8'));

    this.update_data();
    setInterval(() => {
      this.update_data();
    }, 1000 * 60 * 60);
  }
  private async update_data() {
    this.naver = await naver_crawler();
    fs.writeFileSync('data/naver.json', JSON.stringify(this.naver));
    this.kakao = await kakao_crawler();
    fs.writeFileSync('data/kakao.json', JSON.stringify(this.kakao));
    this.kakaoPage = await kakaoPage_crawler();
    fs.writeFileSync('data/kakaoPage.json', JSON.stringify(this.kakaoPage));
  }

  weekdayWebtoon(platform: PlatformObject) {
    const weekdayWebtoon: Webtoon[] = [];
    platform.weekdayWebtoon.forEach((_weekdayWebtoon) => {
      weekdayWebtoon.push(..._weekdayWebtoon);
    });
    return weekdayWebtoon;
  }
  finishedWebtoon = (platform: PlatformObject) => platform.finishedWebtoon;

  allWebtoon = (platform: PlatformObject) =>
    this.weekdayWebtoon(platform).concat(this.finishedWebtoon(platform));
}
