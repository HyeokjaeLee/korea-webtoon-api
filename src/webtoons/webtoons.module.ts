import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebtoonsController } from './webtoons.controller';
import { UpdateInfoController } from './update-info.controller';
import { WebtoonsService } from './webtoons.service';
import { UpdateInfoService } from './update-info.service';
import { Webtoon, WebtoonSchema } from './schemas/webtoon.schema';
import { UpdateInfo, UpdateInfoSchema } from './schemas/update-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Webtoon.name, schema: WebtoonSchema },
      { name: UpdateInfo.name, schema: UpdateInfoSchema },
    ]),
  ],
  controllers: [WebtoonsController, UpdateInfoController],
  providers: [WebtoonsService, UpdateInfoService],
})
export class WebtoonsModule {
  constructor() {}
}
