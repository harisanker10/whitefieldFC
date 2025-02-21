import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Email, EmailEntity } from 'src/schemas/email.schema';

interface CreateEmailDto {
  from: string;
  to: string;
  inReplyTo?: string;
  subject: string;
  body: string;
  date: Date;
  messageId: string;
  threadId?: string;
}

@Injectable()
export class EmailRepository {
  constructor(
    @InjectModel(Email.name) private readonly emailModel: Model<Email>,
  ) {}

  create(email: CreateEmailDto): Promise<EmailEntity | void> {
    return new this.emailModel(email)
      .save()
      .then((doc) => doc.toObject<EmailEntity>())
      .catch((err) => console.log({ err }));
  }

  createMany(emails: CreateEmailDto[]) {
    return this.emailModel
      .insertMany(emails)
      .then((docs) => (docs.length > 0 ? true : false))
      .catch((err) => console.log({ err }));
  }

  findAll(): Promise<EmailEntity[]> {
    return this.emailModel
      .find()
      .then((docs) => docs.map((doc) => doc.toObject<EmailEntity>()));
  }

  findById(id: string): Promise<EmailEntity | null> {
    return this.emailModel
      .findById(new Types.ObjectId(id))
      .then((doc) => (doc ? doc.toObject<EmailEntity>() : null));
  }

  findByMessageId(messageId: string): Promise<EmailEntity | null> {
    return this.emailModel
      .findOne({ messageId })
      .then((doc) => (doc ? doc.toObject<EmailEntity>() : null));
  }

  findByThreadId(threadId: string): Promise<EmailEntity[]> {
    return this.emailModel
      .find({ threadId })
      .then((docs) => docs.map((doc) => doc.toObject<EmailEntity>()));
  }

  update(id: string, email: Partial<EmailEntity>): Promise<any> {
    return this.emailModel
      .updateOne({ _id: new Types.ObjectId(id) }, { $set: email })
      .then((result) => result);
  }

  delete(id: string): Promise<any> {
    return this.emailModel
      .deleteOne({ _id: new Types.ObjectId(id) })
      .then((result) => result);
  }

  findBySender(sender: string): Promise<EmailEntity[]> {
    return this.emailModel
      .find({ from: sender })
      .then((docs) => docs.map((doc) => doc.toObject<EmailEntity>()));
  }

  findByRecipient(recipient: string): Promise<EmailEntity[]> {
    return this.emailModel
      .find({ to: recipient })
      .then((docs) => docs.map((doc) => doc.toObject<EmailEntity>()));
  }

  getReplies(messageId: string): Promise<EmailEntity[]> {
    return this.emailModel
      .find({ inReplyTo: messageId })
      .then((docs) => docs.map((doc) => doc.toObject<EmailEntity>()));
  }
}
