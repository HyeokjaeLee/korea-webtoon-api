import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Webtoon, WebtoonSchema } from './schemas/webtoon.schema';
import { WebtoonController } from './webtoon.controller';
import { WebtoonService } from './webtoon.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Webtoon.name, schema: WebtoonSchema }]),
  ],
  controllers: [WebtoonController],
  providers: [WebtoonService],
  exports: [WebtoonService],
})
export class WebtoonModule {}
