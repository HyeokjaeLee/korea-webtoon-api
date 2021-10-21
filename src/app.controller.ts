import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  webtoon() {
    return this.appService.webtoon();
  }

  @Get('/naver')
  naver() {
    return this.appService.naverWebtoon();
  }
  @Get('/kakao')
  kakao() {
    return this.appService.kakaoWebtoon();
  }
}
