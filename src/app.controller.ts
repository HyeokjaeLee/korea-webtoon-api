import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

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
    console.log(week[day]);
    if (!day) return this.combine_weekWebtoon();
    else if (0 <= week[day] && week[day] <= 6)
      return this.platform.weekWebtoon[week[day]];
    else
      return {
        statusCode: 400,
        message: 'Invalid day value',
        error: 'Not Found',
      };
  }
  @Get('search')
  search(@Query('keyword') keyword: string) {
    const allWebtoon = this.all();
    const filteredResult = allWebtoon.filter((webtoon) => {
      const str4search =
        webtoon.title.toLowerCase() + webtoon.author.toLowerCase();
      return str4search.includes(keyword);
    });
    return filteredResult;
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

@Controller('all')
export class RootController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super();
    this.platform = this.appService.getAllWebtoon();
  }
}
