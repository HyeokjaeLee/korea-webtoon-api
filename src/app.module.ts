import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SearchController,
  AllPlatformController,
  KakaoController,
  KakaoPageController,
  NaverController,
} from './app.controller';
import { AppService } from './app.service';
const MONGO_DB_URL =
  'mongodb+srv://hyeokjaelee:44nud95974@webtoon.xvqi5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
@Module({
  imports: [MongooseModule.forRoot(MONGO_DB_URL)],
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
