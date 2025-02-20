import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type AttendancesEntity = {
  coachId: string;
  sessionId: string;
  status: AttendanceStatus;
  lateInMinutes: Date;
};

export enum AttendanceStatus {
  ATTENDED = 'ATTENDED',
  PENDING = 'PENDING',
  ABSENT = 'ABSENT',
}

@Schema({
  collection: 'attendances',
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
export class Attendances {
  @Prop({ type: Types.ObjectId, ref: 'coaches', required: true })
  coachId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'sessions', required: true })
  sessionId: Types.ObjectId;

  @Prop({ default: AttendanceStatus.PENDING, enum: AttendanceStatus })
  status: AttendanceStatus;

  @Prop({ type: Number })
  lateInMinutes: number;
}

export const AttendancesSchema = SchemaFactory.createForClass(Attendances);
