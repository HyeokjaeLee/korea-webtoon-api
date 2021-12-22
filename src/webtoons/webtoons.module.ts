import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebtoonsController } from './webtoons.controller';
import { WebtoonsService } from './webtoons.service';
import { Webtoon, WebtoonSchema } from './schemas/webtoon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Webtoon.name, schema: WebtoonSchema }]),
  ],
  controllers: [WebtoonsController],
  providers: [WebtoonsService],
})
export class WebtoonsModule {}
