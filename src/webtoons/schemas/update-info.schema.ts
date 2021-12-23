import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UpdateInfoDocument = UpdateInfo & Document;

@Schema({
  versionKey: false,
  id: false,
})
export class UpdateInfo {
  @Prop({ required: true })
  new: number;
  @Prop({ required: true })
  changed: number;
  @Prop({ required: true })
  removed: number;
  @Prop({ required: true })
  total: number;
  @Prop({ required: true })
  date: Date;
}

export const UpdateInfoSchema = SchemaFactory.createForClass(UpdateInfo);
