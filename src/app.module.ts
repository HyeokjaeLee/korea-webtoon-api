import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PASSWORD } from '../temp-password';
const MONGO_DB_URI = `mongodb+srv://nagle:${PASSWORD}@cluster0.uko3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
@Module({
  imports: [MongooseModule.forRoot(MONGO_DB_URI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
