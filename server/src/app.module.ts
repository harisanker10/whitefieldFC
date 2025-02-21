import { Module } from '@nestjs/common';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from './config/env';
import { CoachesModule } from './modules/coaches/coaches.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
  imports: [
    MongooseModule.forRoot(ENV.DB_URI, { dbName: 'whitefieldFC' }),
    SessionsModule,
    CoachesModule,
    AttendancesModule,
    EmailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
