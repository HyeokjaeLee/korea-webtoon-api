import { Injectable } from '@nestjs/common';
import naver_crawler from './function/naver-crawler';
import kakao_crawler from './function/kakao-crawler';
import kakaoPage_crawler from './function/kakaoPage-crawler';
import { Webtoon } from './types/webtoon';

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
    this.update_data();
    setInterval(() => {
      this.update_data();
    }, 1000 * 60 * 60);
  }
  private async update_data() {
    this.kakao = await kakao_crawler();
    this.naver = await naver_crawler();
    this.kakaoPage = await kakaoPage_crawler();
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
