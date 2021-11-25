import { Module } from '@nestjs/common';
import {
  SearchController,
  AllPlatformController,
  KakaoController,
  KakaoPageController,
  NaverController,
} from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    SearchController,
    AllPlatformController,
    KakaoController,
    KakaoPageController,
    NaverController,
  ],
  providers: [AppService],
})
export class AppModule {}
