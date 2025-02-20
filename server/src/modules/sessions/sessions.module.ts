import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sessions, SessionSchema } from 'src/schemas/sessions.schema';
import { SessionsRepository } from './session.repository';
import { Attendances, AttendancesSchema } from 'src/schemas/attendance.schema';
import { AttendancesModule } from '../attendances/attendances.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sessions.name, schema: SessionSchema }]),
    AttendancesModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
})
export class SessionsModule {}
