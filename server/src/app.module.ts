import { Module } from '@nestjs/common';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from './config/env';
import { CoachesModule } from './modules/coaches/coaches.module';

@Module({
  imports: [
    MongooseModule.forRoot(ENV.DB_URI, { dbName: 'whitefieldFC' }),
    SessionsModule,
    CoachesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
