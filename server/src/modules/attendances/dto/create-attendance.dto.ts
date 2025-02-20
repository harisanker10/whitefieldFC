import { AttendanceStatus } from 'src/schemas/attendance.schema';

export class CreateAttendanceDto {
  coachId: string;
  sessionId: string;
  status?: AttendanceStatus;
  attendedTime?: Date;
}
