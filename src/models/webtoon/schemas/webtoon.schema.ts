import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UpdateDay, Singularity, Service } from '../../../types';

@Schema({ versionKey: false, id: false })
export class Webtoon {
  @Prop({ required: true, unique: true, index: true })
  webtoonId: number;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  img: string;
  @Prop({ required: true })
  service: Service;
  @Prop({ required: true, type: [String] })
  updateDays: UpdateDay[];
  @Prop({ type: Number })
  fanCount: number | null;
  @Prop({ required: true })
  searchKeyword: string;
  @Prop({ required: true, type: Object })
  additional: {
    new: boolean;
    rest: boolean;
    up: boolean;
    adult: boolean;
    singularityList: Singularity[];
  };
}

export type WebtoonDocument = Webtoon & Document;

export const WebtoonSchema = SchemaFactory.createForClass(Webtoon);
