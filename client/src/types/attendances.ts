import { Session } from "@/types/sessions";

export type Attendance = {
  coachId: string;
  sessionId: string;
  session?: Session;
  status: AttendanceStatus;
  lateInMinutes: number;
};

export enum AttendanceStatus {
  ATTENDED = "ATTENDED",
  PENDING = "PENDING",
  ABSENT = "ABSENT",
}
