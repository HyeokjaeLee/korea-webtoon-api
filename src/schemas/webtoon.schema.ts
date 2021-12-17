import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebtoonDocument = Webtoon & Document;
@Schema()
export class Webtoon {
  @Prop()
  name: string;
}
