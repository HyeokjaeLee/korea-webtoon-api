import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { uniqBy } from 'lodash';

enum week {
  'mon' = 0,
  'tue' = 1,
  'wed' = 2,
  'thu' = 3,
  'fri' = 4,
  'sat' = 5,
  'sun' = 6,
}

function combine_weekWebtoon(weekWebtoon: Webtoon[][]) {
  const combinedWeekWebtoon: Webtoon[] = [];
  weekWebtoon.forEach((webtoon) => {
    combinedWeekWebtoon.push(...webtoon);
  });
  return combinedWeekWebtoon;
}

class WebtoonController {
  platform: PlatformObject;
  combined_weekWebtoon: Webtoon[];
  allWebtoon: Webtoon[];
  constructor(platform: PlatformObject) {
    this.platform = platform;
    this.combined_weekWebtoon = combine_weekWebtoon(this.platform.weekWebtoon);
    this.allWebtoon = this.combined_weekWebtoon.concat(
      this.platform.finishedWebtoon,
    );
  }
  @Get('week')
  weekday(@Query('day') day: string) {
    if (!day) return this.combined_weekWebtoon;
    else if (0 <= week[day] && week[day] <= 6)
      return this.platform.weekWebtoon[week[day]];
    else
      return {
        statusCode: 400,
        message: 'Invalid day value',
        error: 'Not Found',
      };
  }

  @Get('finished')
  finished() {
    return this.platform.finishedWebtoon;
  }
  @Get()
  all() {
    return this.allWebtoon;
  }
  @Get('test')
  test() {
    return this.platform;
  }
}

@Controller()
export class SearchController {
  allWebtoon: Webtoon[];
  constructor(private readonly appService: AppService) {
    const platform = this.appService.getAllWebtoon();
    const combined_weekWebtoon = combine_weekWebtoon(platform.weekWebtoon);
    this.allWebtoon = combined_weekWebtoon.concat(platform.finishedWebtoon);
  }
  @Get()
  search(@Query('search') search: string) {
    if (!search)
      return {
        statusCode: 500,
        message:
          'Required request variable does not exist or request variable name is invalid',
        error: 'Error',
      };
    search = search.toLowerCase().replace(/\s/g, '');

    const filteredWebtoon = this.allWebtoon.filter((webtoon) => {
      const str4search = (
        webtoon.title.toLowerCase() + webtoon.author.toLowerCase()
      ).replace(/\s/g, '');
      return str4search.includes(search);
    });

    if (filteredWebtoon.length === 0)
      return {
        statusCode: 404,
        message: 'No webtoon found',
        error: 'Not Found',
      };

    return uniqBy(filteredWebtoon, (e) => e.title + e.author).map((webtoon) => {
      delete webtoon.week;
      return webtoon;
    });
  }
}

@Controller('naver')
export class NaverController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super(appService.webtoon.naver);
  }
}

@Controller('kakao')
export class KakaoController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super(appService.webtoon.kakao);
  }
}

@Controller('kakao-page')
export class KakaoPageController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super(appService.webtoon.kakaoPage);
  }
}

@Controller('all')
export class AllPlatformController extends WebtoonController {
  constructor(private readonly appService: AppService) {
    super(appService.getAllWebtoon());
  }
}
