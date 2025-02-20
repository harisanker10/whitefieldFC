import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coaches, CoachesEntity } from 'src/schemas/coach.schema';

@Injectable()
export class CoachesRepository {
  constructor(
    @InjectModel(Coaches.name)
    private readonly coachModel: Model<Coaches>,
  ) {}

  findAllCoaches(): Promise<CoachesEntity[]> {
    return this.coachModel
      .find()
      .then((docs) =>
        docs.length > 0
          ? docs.map((doc) => doc && doc.toObject<CoachesEntity>())
          : [],
      );
  }

  createCoach(dto: { name: string; email: string }): Promise<CoachesEntity> {
    return new this.coachModel(dto)
      .save()
      .then((doc) => doc.toObject<CoachesEntity>());
  }
}
