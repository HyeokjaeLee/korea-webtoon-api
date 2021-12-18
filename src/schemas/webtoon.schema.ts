import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebtoonDocument = Webtoon & Document;
@Schema()
export class Webtoon {
  @Prop()
  title: string;
  @Prop()
  author: string;
  @Prop()
  url: string;
  @Prop()
  image: string;
  @Prop([Number])
  week: number[];
  @Prop()
  additional: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
  };
}
