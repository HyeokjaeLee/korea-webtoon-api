import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { Webtoon } from './schemas/webtoon.schema';

@Controller('cats')
export class WebtoonsController {
  constructor(private readonly webtoonsService: WebtoonsService) {}

  @Post()
  async create(@Body() createWebtoonDto: WebtoonObject.Dto) {
    await this.webtoonsService.create(createWebtoonDto);
  }

  @Get()
  async findAll(): Promise<Webtoon[]> {
    return this.webtoonsService.findAll();
  }
}
