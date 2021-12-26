import { Controller, Get, Query } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';

class WebtoonsController {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    platform: string,
  ) {
    platform !== 'all' && (this.serviceOption.service = platform);
  }
  private serviceOption: { service?: string } = {};
  platform: string;
  @Get()
  async all() {
    return this.webtoonsService.find(this.serviceOption);
  }

  @Get('finished')
  async finished() {
    return this.webtoonsService.find({
      ...this.serviceOption,
      week: { $in: [7] },
    });
  }

  @Get('week')
  async week(@Query('day') day: string) {
    const dayNum = Number(day);
    if (!day)
      return this.webtoonsService.find({
        ...this.serviceOption,
        week: { $nin: [7] },
      });

    if (0 <= dayNum && dayNum <= 6)
      return this.webtoonsService.find({
        ...this.serviceOption,
        week: { $in: [dayNum] },
      });

    return {
      statusCode: 400,
      message: 'Invalid day value',
      error: 'Not Found',
    };
  }
}

@Controller('search')
export class SearchController {
  constructor(private readonly webtoonsService: WebtoonsService) {}
  @Get()
  async search(@Query(`keyword`) keyword: string) {
    if (!!keyword) {
      keyword = keyword.replace(/%20| /g, '');
      const result = this.webtoonsService.find({
        _id: { $regex: `${keyword}[^naver|kakao|kakao-page]+`, $options: 'i' },
      });
      return (await result).length !== 0
        ? result
        : {
            statusCode: 404,
            message: 'There is no webtoon that matches.',
            error: 'Not Found',
          };
    } else
      return {
        statusCode: 500,
        message:
          'Required request variable does not exist or request variable name is invalid.',
        error: 'Error',
      };
  }
}

@Controller('all')
export class AllPlatformController extends WebtoonsController {
  constructor(_super: WebtoonsService) {
    super(_super, 'all');
  }
}

@Controller('naver')
export class NaverController extends WebtoonsController {
  constructor(_super: WebtoonsService) {
    super(_super, 'naver');
  }
}

@Controller('kakao')
export class KakaoController extends WebtoonsController {
  constructor(_super: WebtoonsService) {
    super(_super, 'kakao');
  }
}

@Controller('kakao-page')
export class KakaoPageController extends WebtoonsController {
  constructor(_super: WebtoonsService) {
    super(_super, 'kakao-page');
  }
}
