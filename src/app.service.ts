import { Injectable } from '@nestjs/common';
import { kill } from 'process';
import { Webtoon } from './types/webtoon';
import * as fs from 'fs';

let naverFinishedWebtoon: Webtoon[] = JSON.parse(
  fs.readFileSync('data/naver-finished-webtoon.json', 'utf8'),
);

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  naverWebtoon() {
    return naverFinishedWebtoon;
  }
}
