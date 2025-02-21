import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coaches, CoachesSchema } from 'src/schemas/coach.schema';
import { CoachesRepository } from './coaches.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coaches.name, schema: CoachesSchema }]),
  ],
  controllers: [CoachesController],
  providers: [CoachesService, CoachesRepository],
  exports: [CoachesRepository],
})
export class CoachesModule {}
