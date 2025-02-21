import { NotFoundException } from '@nestjs/common';
import { CoachesRepository } from '../coaches/coaches.repository';
import { EmailRepository } from './emails.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Coaches } from 'src/schemas/coach.schema';
import { Model } from 'mongoose';

export class EmailsService {
  constructor(
    private readonly emailRepository: EmailRepository,
    @InjectModel(Coaches.name) private readonly coachModel: Model<Coaches>,
  ) {}

  async getEmailsOfCoach(coachId: string) {
    console.log({ gettingemailsof: coachId });
    const coach = await this.coachModel.findOne({ _id: coachId });
    if (!coach?.email) {
      throw new NotFoundException('Coach id not found');
    }
    return this.emailRepository.findByRecipient(coach.email);
  }

  async getReplies(coachId: string) {
    console.log({ gettingrepliesof: coachId });
    const coach = await this.coachModel.findOne({ _id: coachId });
    if (!coach?.email) {
      throw new NotFoundException('Coach id not found');
    }
    return this.emailRepository.findBySender(coach.email);
  }
}
