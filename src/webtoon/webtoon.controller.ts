import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './webtoon.service';
import { CreateCatDto } from './dto/create-webtoon.dto';
import { Cat } from './schemas/webtoon.schema';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    await this.catsService.create({ name: 'test', age: 1, breed: 'test' });
    return this.catsService.findAll();
  }
}
