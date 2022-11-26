require('dotenv').config();
const { MONGO_DB_URI } = process.env;
import { Module } from '@nestjs/common';
import { WebtoonModule } from './models/webtoon/webtoon.module';
import { MongooseModule } from '@nestjs/mongoose';

if (!MONGO_DB_URI) {
  throw new Error('MONGO_DB_URI is not defined');
}
@Module({
  imports: [MongooseModule.forRoot(MONGO_DB_URI), WebtoonModule],
})
export class AppModule {}
