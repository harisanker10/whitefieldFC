import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sessions, SessionSchema } from 'src/schemas/sessions.schema';
import { SessionsRepository } from './session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sessions.name, schema: SessionSchema }]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
})
export class SessionsModule {}
