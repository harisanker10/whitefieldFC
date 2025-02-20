import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Attendances,
  AttendancesEntity,
  AttendanceStatus,
} from 'src/schemas/attendance.schema';

@Injectable()
export class AttendancesRepository {
  constructor(
    @InjectModel(Attendances.name)
    private readonly attendanceModel: Model<Attendances>,
  ) {}

  createAttendance(dto: {
    sessionId: string;
    coachId: string;
    status?: AttendanceStatus;
    lateInMinutes?: Date;
  }) {
    return new this.attendanceModel({
      sessionId: new Types.ObjectId(dto.sessionId),
      coachId: new Types.ObjectId(dto.coachId),
      status: dto.status || AttendanceStatus.PENDING,
      lateInMinutes: dto.lateInMinutes || undefined,
    })
      .save()
      .then((doc) => doc.toObject<AttendancesEntity>());
  }

  async findAttendance({
    sessionId,
    coachId,
    attendanceId,
  }: {
    sessionId?: string;
    coachId?: string;
    attendanceId?: string;
  }): Promise<AttendancesEntity[]> {
    const filter: any = {};

    if (sessionId) filter.sessionId = new Types.ObjectId(sessionId);
    if (coachId) filter.coachId = new Types.ObjectId(coachId);
    if (attendanceId) filter._id = new Types.ObjectId(attendanceId);

    const attendances = await this.attendanceModel
      .find(filter)
      .then((docs) =>
        docs.length > 0
          ? docs.map((doc) => doc.toObject<AttendancesEntity>())
          : [],
      );

    return attendances;
  }

  async findBySessionId(sessionId: string): Promise<AttendancesEntity[]> {
    const attendances = await this.attendanceModel
      .find({ sessionId: new Types.ObjectId(sessionId) })
      .then((docs) =>
        docs.length > 0
          ? docs.map((doc) => doc && doc.toObject<AttendancesEntity>())
          : [],
      );

    return attendances;
  }

  findByCoachId(coachId: string) {
    return this.attendanceModel
      .find({ coachId })
      .then(
        (docs) =>
          docs.length > 0 &&
          docs.map((doc) => doc.toObject<AttendancesEntity>()),
      );
  }
  updateStatus(dto: { attendanceId: string; status: AttendanceStatus }) {
    return this.attendanceModel.updateOne(
      { _id: dto.attendanceId },
      { $set: { status: dto.status } },
    );
  }

  updateAttendedTime(dto: { attendanceId: string; attendedTime: Date }) {
    return this.attendanceModel.updateOne(
      { _id: dto.attendanceId },
      { $set: { attendedTime: dto.attendedTime } },
    );
  }
}
