require('dotenv').config();
const { MONGO_DB_URI } = process.env;
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebtoonsModule } from './webtoons/webtoons.module';

@Module({
  imports: [MongooseModule.forRoot(MONGO_DB_URI), WebtoonsModule],
})
export class AppModule {}
