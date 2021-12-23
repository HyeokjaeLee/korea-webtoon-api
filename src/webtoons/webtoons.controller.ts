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
