import { PASSWORD } from '../temp-password';
const MONGO_DB_URI = `mongodb+srv://nagle:${PASSWORD}@cluster0.uko3q.mongodb.net/test?retryWrites=true&w=majority`;
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebtoonsModule } from './webtoon/webtoons.module';

@Module({
  imports: [MongooseModule.forRoot(MONGO_DB_URI), WebtoonsModule],
})
export class AppModule {}
