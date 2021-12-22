import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webtoon, WebtoonDocument } from './schemas/webtoon.schema';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectModel(Webtoon.name)
    private readonly webtoonModel: Model<WebtoonDocument>,
  ) {}

  async create(createWebtoonDto: WebtoonObject.CreateDto): Promise<Webtoon> {
    const createdWebtoon = await this.webtoonModel.create(createWebtoonDto);
    return createdWebtoon;
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonModel.find().exec();
  }
}
