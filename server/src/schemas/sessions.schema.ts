import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'sessions',
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
export class Sessions {
  @Prop({ type: Types.ObjectId, ref: 'coaches' })
  coachId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  startTime: Date;

  @Prop({ required: true, type: Date })
  endTime: Date;

  @Prop({ enum: ['ONGOING', 'ASSIGNED'] })
  status: 'ONGOING' | 'ASSIGNED';
}

export type SessionEntity = {
  id: string;
  coachId: string | undefined;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum SessionStatus {
  ONGOING = 'ONGOING',
  ASSIGNED = 'ASSIGNED',
}

export const SessionSchema = SchemaFactory.createForClass(Sessions);
