import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendancesRepository } from './attendences.repository';

import { AttendanceStatus } from 'src/schemas/attendance.schema';

@Injectable()
export class AttendancesService {
  constructor(private readonly attendanceRepository: AttendancesRepository) {}
  create(createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceRepository.createAttendance(createAttendanceDto);
  }

  findAttendance(dto: {
    sessionId?: string;
    coachId?: string;
    attendanceId?: string;
  }) {
    return this.attendanceRepository.findAttendance(dto);
  }

  findAttendanceWithSessionId(sessionId: string) {
    return this.attendanceRepository.findBySessionId(sessionId);
  }

  findAttendanceWithCoachId(coachId: string) {
    return this.attendanceRepository.findByCoachId(coachId);
  }

  updateStatus({
    attendanceId,
    status,
  }: {
    attendanceId: string;
    status: string;
  }) {
    return this.attendanceRepository.updateStatus({
      attendanceId,
      status: status as AttendanceStatus,
    });
  }

  updateAttendedTime({
    attendanceId,
    attendedTime,
  }: {
    attendanceId: string;
    attendedTime: Date;
  }) {
    return this.attendanceRepository.updateAttendedTime({
      attendedTime,
      attendanceId,
    });
  }
}
