import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get('/')
  async getAttendance(
    @Query('sessionId') sessionId: string,
    @Query('coachId') coachId: string,
  ) {
    const att = await this.attendancesService.findAttendance({
      sessionId,
      coachId,
    });
    console.log({ att, sessionId, coachId });
    return att;
  }
  @Get('/:attendanceId')
  getAttendanceWithAttendanceId(@Param('id') attendanceId: string) {
    if (!attendanceId) {
      throw new BadRequestException();
    }

    return this.attendancesService.findAttendance({
      attendanceId,
    });
  }
}
