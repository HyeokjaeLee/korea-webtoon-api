import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { Webtoon } from './schemas/webtoon.schema';

class WebtoonsController {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    platform: string,
  ) {
    this.serviceOption.service = platform;
  }
  private serviceOption;
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
        statusCode: 400,
        message:
          'Required request variable does not exist or request variable name is invalid	',
        error: 'Error',
      };
  }
}
