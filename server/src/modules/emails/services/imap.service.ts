import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Catch,
  UseFilters,
} from '@nestjs/common';
import * as imaps from 'imap-simple';
import { ExceptionsFilter } from 'src/common/filters/exception.filter';
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
    const sentEmails = await this.fetchSentEmails();
    console.log({ sentEmails });
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
        await this.fetchUnreadEmails();
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

  private async fetchUnreadEmails() {
    try {
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };

      const messages = await this.imapConnection.search(
        searchCriteria,
        fetchOptions,
      );
      return messages
        .filter((msg) => {
          const subject = msg.parts.find((p) => p.which === 'HEADER')?.body
            .subject[0];
          if (typeof subject === 'string') {
            return subject.toLowerCase().includes('whitefieldfc');
          }
        })
        .map((msg) => {
          const from = msg.parts.find((p) => p.which === 'HEADER')?.body
            .from[0];
          const subject = msg.parts.find((p) => p.which === 'HEADER')?.body
            .subject[0];
          const body = msg.parts.find((p) => p.which === 'TEXT')?.body;
          return {
            from,
            subject,
            body,
          };
        });
    } catch (error) {
      this.logger.error('Error fetching emails', error);
    }
  }

  private async fetchSentEmails() {
    try {
      await this.imapConnection.openBox('[Gmail]/Sent Mail');
      const searchCriteria = ['ALL', ['SINCE', 'Feb 20, 2025']];

      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
      };

      const messages = await this.imapConnection.search(
        searchCriteria,
        fetchOptions,
      );

      return messages
        .map((msg) => {
          const header =
            msg &&
            msg.parts &&
            msg.parts.find((part) => part?.which === 'HEADER')?.body;
          const body = msg?.parts?.find((part) => part?.which === 'TEXT')?.body;

          const from = (header?.from[0].match(/<(.*?)>/)[0] as string)
            .split('<')[1]
            .split('>')[0];
          const to = (header?.to[0].match(/<(.*?)>/)[0] as string)
            .split('<')[1]
            .split('>')[0];
          const inReplyTo = header['in-reply-to'][0]
            .match(/<(.*?)>/)[0]
            .split('<')[1]
            .split('>')[0];
          const subject = header?.subject[0];
          return {
            from,
            to,
            inReplyTo,
            subject,
            body,
          };
        })
        .filter((msg) =>
          (msg.subject as string).toLowerCase().includes('whitefieldfc'),
        );
    } catch (err) {
      this.logger.error('Error getting Sent messages', err.name);
    }
  }
}
