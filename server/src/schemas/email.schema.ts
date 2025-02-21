import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'emails',
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
export class Email {
  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String })
  inReplyTo: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, unique: true })
  messageId: string;

  @Prop({ type: String })
  threadId: string;
}

export type EmailEntity = {
  id: string;
  from: string;
  to: string;
  inReplyTo: string;
  subject: string;
  body: string;
  date: Date;
  messageId: string;
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const EmailSchema = SchemaFactory.createForClass(Email);
