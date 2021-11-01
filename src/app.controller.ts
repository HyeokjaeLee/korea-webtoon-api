import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PlatformObject, Webtoon } from './types/webtoon';

enum week {
  'mon' = 0,
  'tue' = 1,
  'wed' = 2,
  'thu' = 3,
  'fri' = 4,
  'sat' = 5,
  'sun' = 6,
}

class WebtoonController {
  platform: PlatformObject;

  private combine_weekWebtoon() {
    const combinedWeekWebtoon: Webtoon[] = [];
    for (let i = 0; i < 7; i++) {
      combinedWeekWebtoon.push(...this.platform.weekWebtoon[i]);
    }
    return combinedWeekWebtoon;
  }

  @Get('week')
  weekday(@Query('day') day: string) {
    if (!day) return this.combine_weekWebtoon();
    else return this.platform.weekWebtoon[week[day]];
  }
  @Get('finished')
  finished() {
    return this.platform.finishedWebtoon;
  }
  @Get()
  all() {
    return this.combine_weekWebtoon().concat(this.finished());
  }
}

@Controller('naver')
export class NaverController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super();
    this.platform = this.appService.webtoon.naver;
  }
}

@Controller('kakao')
export class KakaoController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super();
    this.platform = this.appService.webtoon.kakao;
  }
}

@Controller('kakao-page')
export class KakaoPageController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super();
    this.platform = this.appService.webtoon.kakaoPage;
  }
}

@Controller()
export class RootController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super();
    this.platform = this.appService.getAllWebtoon();
  }
  @Get('updated')
  updated() {
    return this.appService.updatedTimeStamp;
  }
}
