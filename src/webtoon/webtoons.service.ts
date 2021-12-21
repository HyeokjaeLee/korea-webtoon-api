import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './dto/create-webtoon.dto';
import { Webtoon, WebtoonDocument } from './schemas/webtoon.schema';

@Injectable()
export class WebtoonsService {
  constructor(
    @InjectModel(Webtoon.name)
    private readonly webtoonModel: Model<WebtoonDocument>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Webtoon> {
    const createdCat = await this.webtoonModel.create(createCatDto);
    return createdCat;
  }

  async findAll(): Promise<Webtoon[]> {
    return this.webtoonModel.find().exec();
  }
}
