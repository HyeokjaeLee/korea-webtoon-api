import { Module } from '@nestjs/common';
import {
  RootController,
  KakaoController,
  KakaoPageController,
  NaverController,
} from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    RootController,
    KakaoController,
    KakaoPageController,
    NaverController,
  ],
  providers: [AppService],
})
export class AppModule {}
