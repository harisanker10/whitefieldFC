import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendances, AttendancesSchema } from 'src/schemas/attendance.schema';
import { AttendancesRepository } from './attendences.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendances.name, schema: AttendancesSchema },
    ]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendancesRepository],
  exports: [AttendancesRepository],
})
export class AttendancesModule {}
