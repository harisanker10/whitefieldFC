import { Injectable } from '@nestjs/common';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { CoachesRepository } from './coaches.repository';

@Injectable()
export class CoachesService {
  constructor(private readonly coachesRepository: CoachesRepository) {}
  create(createCoachDto: CreateCoachDto) {
    return this.coachesRepository.createCoach(createCoachDto);
  }

  async findAll() {
    return await this.coachesRepository.findAllCoaches();
  }
}
