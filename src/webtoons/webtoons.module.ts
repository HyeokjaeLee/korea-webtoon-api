import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SearchController,
  AllPlatformController,
  NaverController,
  KakaoController,
  KakaoPageController,
} from './webtoons.controller';
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
  controllers: [
    UpdateInfoController,
    SearchController,
    AllPlatformController,
    NaverController,
    KakaoController,
    KakaoPageController,
  ],
  providers: [WebtoonsService, UpdateInfoService],
})
export class WebtoonsModule {
  constructor() {}
}
