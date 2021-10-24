import { Injectable } from '@nestjs/common';
import naver_crawler from './function/naver-crawler';
import kakao_crawler from './function/kakao-crawler';
import { Webtoon } from './types/webtoon';

interface PlatformObject {
  weekdayWebtoon: Webtoon[][];
  finishedWebtoon: Webtoon[];
}

const combineWeekdayWebtoon = (weekdayWebtoon: Webtoon[][]) => [
  ...weekdayWebtoon[0],
  ...weekdayWebtoon[1],
  ...weekdayWebtoon[2],
  ...weekdayWebtoon[3],
  ...weekdayWebtoon[4],
  ...weekdayWebtoon[5],
  ...weekdayWebtoon[6],
];

@Injectable()
export class AppService {
  private kakao: PlatformObject;
  private naver: PlatformObject;
  constructor() {
    this.update_data();
    setInterval(() => {
      this.update_data();
    }, 1000 * 60 * 60);
  }

  private async update_data() {
    this.kakao = await kakao_crawler();
    this.naver = await naver_crawler();
  }

  kakaoFinishedWebtoon() {
    if (!!this.kakao) return this.kakao.finishedWebtoon;
  }
  kakaoWeeklyWebtoon() {
    if (!!this.kakao) return combineWeekdayWebtoon(this.kakao.weekdayWebtoon);
  }
  kakaoWebtoon() {
    if (!!this.kakao)
      return this.kakaoWeeklyWebtoon().concat(this.kakaoFinishedWebtoon());
  }
  naverFinishedWebtoon() {
    if (!!this.naver) return this.naver.finishedWebtoon;
  }
  naverWeeklyWebtoon() {
    if (!!this.naver) return combineWeekdayWebtoon(this.naver.weekdayWebtoon);
  }
  naverWebtoon() {
    if (!!this.naver)
      return this.naverWeeklyWebtoon().concat(this.naverFinishedWebtoon());
  }
  webtoon() {
    if (!!this.kakao && !!this.naver)
      return this.kakaoWebtoon().concat(this.naverWebtoon());
  }
}
