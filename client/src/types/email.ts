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
