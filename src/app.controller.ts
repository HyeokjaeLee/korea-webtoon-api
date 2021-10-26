import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('naver')
export class NaverController {
  constructor(private readonly appService: AppService) {}
  @Get('weekday')
  weekday() {
    return this.appService.weekdayWebtoon(this.appService.naver);
  }
  @Get('finished')
  finished() {
    return this.appService.finishedWebtoon(this.appService.naver);
  }

  @Get()
  all() {
    return this.appService.allWebtoon(this.appService.naver);
  }
}

@Controller('kakao')
export class KakaoController {
  constructor(private readonly appService: AppService) {}
  @Get('weekday')
  weekday() {
    return this.appService.weekdayWebtoon(this.appService.kakao);
  }
  @Get('finished')
  finished() {
    return this.appService.finishedWebtoon(this.appService.kakao);
  }

  @Get()
  all() {
    return this.appService.allWebtoon(this.appService.kakao);
  }
}

@Controller('kakao-page')
export class KakaoPageController {
  constructor(private readonly appService: AppService) {}
  @Get('weekday')
  weekday() {
    return this.appService.weekdayWebtoon(this.appService.kakaoPage);
  }
  @Get('finished')
  finished() {
    return this.appService.finishedWebtoon(this.appService.kakaoPage);
  }

  @Get()
  all() {
    return this.appService.allWebtoon(this.appService.kakaoPage);
  }
}

@Controller()
export class RootController {
  constructor(private readonly appService: AppService) {}
  @Get('weekday')
  weekday() {
    return [
      ...this.appService.weekdayWebtoon(this.appService.naver),
      ...this.appService.weekdayWebtoon(this.appService.kakao),
      ...this.appService.weekdayWebtoon(this.appService.kakaoPage),
    ];
  }
  @Get('finished')
  finished() {
    return [
      ...this.appService.finishedWebtoon(this.appService.naver),
      ...this.appService.finishedWebtoon(this.appService.kakao),
      ...this.appService.finishedWebtoon(this.appService.kakaoPage),
    ];
  }

  @Get()
  all() {
    return [...this.weekday(), ...this.finished()];
  }
}
