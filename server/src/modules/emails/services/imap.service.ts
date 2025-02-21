import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  UseFilters,
} from '@nestjs/common';
import * as imaps from 'imap-simple';
import { ExceptionsFilter } from 'src/common/filters/exception.filter';
import { formateAngleBracketText } from 'src/common/helpers/formatEmailInAngleBracket';
import { ENV } from 'src/config/env';

@Injectable()
@UseFilters(new ExceptionsFilter())
export class ImapService implements OnModuleInit, OnModuleDestroy {
  private imapConnection: imaps.ImapSimple;
  private readonly logger = new Logger(ImapService.name);

  private readonly config = {
    imap: {
      user: ENV.EMAIL_ID,
      password: ENV.EMAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
    },
  };

  async onModuleInit() {
    this.logger.log('Initializing Email Listener...');
    await this.startEmailListener();
    await this.listMailboxes();
    // const sentEmails = await this.fetchSentEmails();
    // console.log({ sentEmails });
  }

  async onModuleDestroy() {
    if (this.imapConnection) {
      this.logger.log('Closing IMAP connection...');
      this.imapConnection.end();
    }
  }

  private async startEmailListener() {
    try {
      this.imapConnection = await imaps.connect(this.config);
      await this.imapConnection.openBox('INBOX');

      this.logger.log('Listening for new emails...');

      this.imapConnection.on('mail', async () => {
        this.logger.log('New email received!');
      });
    } catch (error) {
      this.logger.error('Error starting IMAP listener', error);
    }
  }

  private async listMailboxes() {
    try {
      const boxes = await this.imapConnection.getBoxes();
    } catch (error) {}
  }

  async fetchUnreadEmails(sinceDate = new Date('2025-02-02')) {
    try {
      const searchCriteria = ['ALL', ['SINCE', sinceDate]];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };

      const messages = await this.imapConnection.search(
        searchCriteria,
        fetchOptions,
      );
      return messages.map((msg) => {
        console.log({ msg: JSON.stringify(msg) });

        const header =
          msg &&
          msg.parts &&
          msg.parts.find((part) => part?.which === 'HEADER')?.body;

        const body = msg?.parts?.find((part) => part?.which === 'TEXT')?.body;

        const messageId = header?.['message-id']?.[0] || null;
        // const messageId = msg.attributes.uid.toString();
        const date = msg.attributes.date;

        const from = header?.from?.[0];
        const to = header?.to?.[0];
        const inReplyTo = header?.['in-reply-to']?.[0];
        const subject = header?.subject?.[0] || null;

        return {
          from: formateAngleBracketText(from),
          to: formateAngleBracketText(to),
          inReplyTo: formateAngleBracketText(inReplyTo),
          messageId: formateAngleBracketText(messageId),
          subject,
          body,
          date,
        };
      });
    } catch (error) {
      this.logger.error('Error fetching emails', error);
    }
  }

  async fetchSentEmails(sinceDate = new Date('Feb 20,2025')) {
    try {
      await this.imapConnection.openBox('[Gmail]/Sent Mail');
      const searchCriteria = ['ALL', ['SINCE', sinceDate]];

      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
      };

      const messages = await this.imapConnection.search(
        searchCriteria,
        fetchOptions,
      );

      console.log({ totalSentMessages: messages.length });

      return messages
        .map((msg) => {
          console.log({ msg: JSON.stringify(msg) });

          const header =
            msg &&
            msg.parts &&
            msg.parts.find((part) => part?.which === 'HEADER')?.body;

          const body = msg?.parts?.find((part) => part?.which === 'TEXT')?.body;

          const messageId = header?.['message-id']?.[0] || null;
          // const messageId = msg.attributes.uid.toString();
          const date = msg.attributes.date;

          const from = header?.from?.[0];
          const to = header?.to?.[0];
          const inReplyTo = header?.['in-reply-to']?.[0];
          const subject = header?.subject?.[0] || null;

          return {
            from: formateAngleBracketText(from),
            to: formateAngleBracketText(to),
            inReplyTo: formateAngleBracketText(inReplyTo),
            messageId: formateAngleBracketText(messageId),
            subject,
            body,
            date,
          };
        })
        .filter(
          (msg) =>
            msg.subject && msg.subject.toLowerCase().includes('whitefieldfc'),
        );
    } catch (err) {
      this.logger.error('Error getting Sent messages', err.name);
      console.log({ err });
    }
  }
}
