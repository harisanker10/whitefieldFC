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

  findBySessionId(sessionId: string) {
    return this.sessionModel
      .findOne({ _id: sessionId })
      .then((doc) => doc && doc.toObject<SessionEntity>());
  }

  async findSession({
    sessionId,
    coachId,
  }: {
    sessionId?: string;
    coachId?: string;
  }): Promise<SessionEntity[]> {
    const matchStage: any = {};
    if (sessionId) {
      matchStage._id = new Types.ObjectId(sessionId);
    }
    if (coachId) {
      matchStage.coachId = new Types.ObjectId(coachId);
    }

    const sessions = await this.sessionModel.aggregate([
      {
        $match: matchStage,
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

    return sessions;
  }

  async findSessionByStartAndEndTime({
    startTime,
    endTime,
  }: {
    startTime: Date;
    endTime: Date;
  }) {
    const sessions = await this.sessionModel.aggregate([
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
    return sessions;
  }

  deleteSession(id: string) {
    return this.sessionModel.findByIdAndDelete(id);
  }

  updateCoachId({
    sessionId,
    coachId,
  }: {
    sessionId: string;
    coachId: string;
  }) {
    if (!Types.ObjectId.isValid(coachId)) {
    }
    return this.sessionModel
      .updateOne(
        { _id: sessionId },
        {
          $set: {
            coachId: Types.ObjectId.isValid(coachId)
              ? new Types.ObjectId(coachId)
              : '',
          },
        },
      )
      .then((doc) => doc.modifiedCount !== 0);
  }
}
