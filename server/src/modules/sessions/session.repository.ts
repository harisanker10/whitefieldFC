import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SessionEntity, Sessions } from 'src/schemas/sessions.schema';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Sessions.name)
    private readonly sessionModel: Model<Sessions>,
  ) {}

  createSession(dto: {
    coachId?: string;
    startTime: Date;
    endTime: Date;
  }): Promise<SessionEntity> {
    return new this.sessionModel({
      ...dto,
      coachId: dto.coachId && new Types.ObjectId(dto.coachId),
    })
      .save()
      .then((doc) => doc.toObject<SessionEntity>());
  }

  async findSessionByStartAndEndTime({
    startTime,
    endTime,
  }: {
    startTime: Date;
    endTime: Date;
  }) {
    return this.sessionModel.aggregate([
      {
        $match: {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        },
      },
      {
        $lookup: {
          from: 'coaches',
          localField: 'coachId',
          foreignField: '_id',
          as: 'coach',
          pipeline: [
            {
              $project: {
                id: '$_id',
                _id: 0,
                name: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$coach',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $unset: ['coachId', '_id'],
      },
    ]);
  }

  deleteSession(id: string) {
    return this.sessionModel.findByIdAndDelete(id);
  }
}
