import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebtoonDocument = Webtoon & Document;

@Schema()
export class Webtoon {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  img: string;
  @Prop({ required: true })
  service: string;
}

export const WebtoonSchema = SchemaFactory.createForClass(Webtoon);
