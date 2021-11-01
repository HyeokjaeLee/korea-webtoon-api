import { Injectable } from '@nestjs/common';
import naver_crawler from './function/naver-crawler';
import kakao_crawler from './function/kakao-crawler';
import kakaoPage_crawler from './function/kakaoPage-crawler';
import { Webtoon, PlatformObject } from './types/webtoon';
import * as fs from 'fs';
import { platform } from 'os';

const readJSON = (platform: string): PlatformObject =>
  JSON.parse(fs.readFileSync(`data/${platform}.json`, 'utf8'));

@Injectable()
export class AppService {
  webtoon = {
    naver: readJSON('naver'),
    kakao: readJSON('kakao'),
    kakaoPage: readJSON('kakaoPage'),
  };
  private platformList = Object.keys(this.webtoon);
  constructor() {
    this.update_data();
    setInterval(() => {
      this.update_data();
    }, 1000 * 60 * 60);
  }
  private async update_data() {
    console.log(`update start (${new Date()})`);
    this.webtoon.naver = await naver_crawler();
    this.webtoon.kakao = await kakao_crawler();
    this.webtoon.kakaoPage = await kakaoPage_crawler();
    //json 파일 업데이트
    this.platformList.forEach((key) => {
      fs.writeFileSync(`data/${key}.json`, JSON.stringify(this.webtoon[key]));
      console.log(`${key}.json save`);
    });
    console.log(`update end (${new Date()})`);
  }
  getAllWebtoon() {
    const weekWebtoon = [];
    for (let i = 0; i < 7; i++) {
      const oneDayWebtoon: Webtoon[] = [];
      this.platformList.forEach((platform) => {
        oneDayWebtoon.push(...this.webtoon[platform].weekWebtoon[i]);
      });
      weekWebtoon.push(oneDayWebtoon);
    }

    const finishedWebtoon = [];
    this.platformList.forEach((platform) => {
      finishedWebtoon.push(...this.webtoon[platform].finishedWebtoon);
    });

    return {
      weekWebtoon,
      finishedWebtoon,
    };
  }
}
