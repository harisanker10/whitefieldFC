import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { ImapService } from './services/imap.service';
import { EmailsService } from './email.service';
import { EmailsJobService } from './jobs/emails.job';
import { EmailRepository } from './emails.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from 'src/schemas/email.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { CoachesModule } from '../coaches/coaches.module';
import { Coaches, CoachesSchema } from 'src/schemas/coach.schema';

@Module({
  imports: [
    CoachesModule,
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    MongooseModule.forFeature([{ name: Coaches.name, schema: CoachesSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [EmailsController],
  providers: [ImapService, EmailsService, EmailsJobService, EmailRepository],
})
export class EmailsModule {}
