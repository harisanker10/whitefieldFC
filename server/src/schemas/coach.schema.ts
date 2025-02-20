import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'coaches',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Coaches {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;
}

export type CoachesEntity = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const CoachesSchema = SchemaFactory.createForClass(Coaches);
