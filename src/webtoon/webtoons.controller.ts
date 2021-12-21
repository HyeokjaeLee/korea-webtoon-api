import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { CreateCatDto } from './dto/create-webtoon.dto';
import { Webtoon } from './schemas/webtoon.schema';

@Controller('cats')
export class WebtoonsController {
  constructor(private readonly catsService: WebtoonsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Webtoon[]> {
    await this.catsService.create({ name: 'test', age: 1, breed: 'test' });
    return this.catsService.findAll();
  }
}
