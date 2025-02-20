export type Attendance = {
  coachId: string;
  sessionId: string;
  status: AttendanceStatus;
  lateInMinutes: number;
};

export enum AttendanceStatus {
  ATTENDED = "ATTENDED",
  PENDING = "PENDING",
  ABSENT = "ABSENT",
}
