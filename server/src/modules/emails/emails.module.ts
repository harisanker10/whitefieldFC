import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { ImapService } from './services/imap.service';
import { EmailsService } from './email.service';

@Module({
  controllers: [EmailsController],
  providers: [ImapService, EmailsService],
})
export class EmailsModule {}
