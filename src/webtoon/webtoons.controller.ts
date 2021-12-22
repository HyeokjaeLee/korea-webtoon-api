import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { Webtoon } from './schemas/webtoon.schema';

@Controller('cats')
export class WebtoonsController {
  constructor(private readonly webtoonsService: WebtoonsService) {
    this.updater();
    const ONE_HOUR = 1000 * 60 * 60;
    setInterval(() => {
      this.updater();
    }, ONE_HOUR);
  }

  @Post()
  async create(@Body() createWebtoonDto: WebtoonObject.CreateDto) {
    await this.webtoonsService.create(createWebtoonDto);
  }

  @Get()
  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsService.findAll();
  }

  async updater() {
    await this.webtoonsService.create({
      id: 1,
      title: 'test',
      author: 'test',
      url: 'test',
      img: 'test',
      service: 'test',
      week: [1, 2, 3, 4, 5, 6, 7],
      additional: {
        new: true,
        rest: true,
        up: true,
        adult: true,
      },
    });
  }
}
