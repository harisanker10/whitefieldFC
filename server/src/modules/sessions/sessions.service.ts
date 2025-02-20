import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepository } from './session.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionRepository: SessionsRepository) {}
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
}
