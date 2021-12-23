import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webtoon, WebtoonDocument } from './schemas/webtoon.schema';
import { UpdateInfo, UpdateInfoDocument } from './schemas/update-info.schema';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectModel(Webtoon.name)
    private readonly webtoonModel: Model<WebtoonDocument>,
  ) {}

  async create(webtoonDto: WebtoonObject.Dto): Promise<Webtoon> {
    const createdWebtoon = await this.webtoonModel.create(webtoonDto);
    return createdWebtoon;
  }
  async update(id: string, webtoonDto: Webtoon) {
    return await this.webtoonModel.findByIdAndUpdate(id, webtoonDto, {
      new: true,
    });
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonModel.find().exec();
  }

  async delete(id: string) {
    return await this.webtoonModel.findByIdAndRemove(id);
  }
}
