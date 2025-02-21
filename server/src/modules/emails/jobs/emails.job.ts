import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailRepository } from '../emails.repository';
import { ImapService } from '../services/imap.service';

@Injectable()
export class EmailsJobService {
  private readonly logger = new Logger(EmailsJobService.name);
  private lastSentMessagesFetchTime = new Date();
  private lastRecievedMessagedFetchtime = new Date();
  constructor(
    private readonly emailRepository: EmailRepository,
    private readonly imapService: ImapService,
  ) {
    this.logger.log('Service initiated.');
    this.lastSentMessagesFetchTime.setHours(-1);
    this.lastRecievedMessagedFetchtime.setHours(-1);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateSentMessages() {
    try {
      this.logger.log('Fetching sent messages..');
      const currentFetchTime = new Date();
      const emails = await this.imapService.fetchSentEmails(
        this.lastSentMessagesFetchTime,
      );
      console.log({ emails });
      emails && this.emailRepository.createMany(emails);
      this.lastSentMessagesFetchTime = currentFetchTime;
    } catch (error) {
      this.logger.error('InsertError');
      console.log({ error });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateRecievedMessages() {
    try {
      this.logger.log('Fetching inbox messages..');
      const currentFetchTime = new Date();
      const emails = await this.imapService.fetchUnreadEmails(
        this.lastRecievedMessagedFetchtime,
      );
      console.log({ emails });
      emails && this.emailRepository.createMany(emails);
      this.lastRecievedMessagedFetchtime = currentFetchTime;
    } catch (error) {
      this.logger.log('InsertError');
      console.log({ error });
    }
  }
}
