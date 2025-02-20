import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepository } from './session.repository';
import { AttendancesRepository } from '../attendances/attendences.repository';
import { AttendanceStatus } from 'src/schemas/attendance.schema';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionsRepository,
    private readonly attendanceReposiory: AttendancesRepository,
  ) {}

  async find({ coachId, day }: { coachId?: string; day?: string }) {
    if (day) {
      const filteredDay = await this.findByDay(day);
      if (coachId) {
        return filteredDay.filter((doc) => doc?.coach?.id === coachId);
      }
    }
    return this.sessionRepository.findSession({
      coachId,
    });
  }

  create(createSessionDto: CreateSessionDto) {
    return this.sessionRepository.createSession({
      endTime: new Date(createSessionDto.endTime),
      startTime: new Date(createSessionDto.startTime),
      coachId: createSessionDto.coachId,
    });
  }

  findByDay(day: string) {
    const startTimeOfDay = new Date(day);
    startTimeOfDay.setHours(0, 0, 0, 0);
    const endTimeOfDay = new Date(day);
    endTimeOfDay.setHours(23, 59, 59, 999);
    return this.sessionRepository.findSessionByStartAndEndTime({
      startTime: startTimeOfDay,
      endTime: endTimeOfDay,
    });
  }

  remove(id: string) {
    return this.sessionRepository.deleteSession(id);
  }

  async updateCoach({
    coachId,
    sessionId,
    markAbsent,
  }: {
    coachId: string;
    sessionId: string;
    markAbsent: boolean;
  }) {
    if (markAbsent) {
      const currentAssignedCoach =
        await this.sessionRepository.findBySessionId(sessionId);
      currentAssignedCoach?.coachId &&
        (await this.attendanceReposiory.createAttendance({
          coachId: currentAssignedCoach?.coachId,
          status: AttendanceStatus.ABSENT,
          sessionId,
        }));
    }
    return this.sessionRepository.updateCoachId({ coachId, sessionId });
  }
}
