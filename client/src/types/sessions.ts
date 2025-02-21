export type Session = {
  id: string;
  coachId?: string | undefined;
  coach?: { id: string; name: string; email: string };
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum SessionStatus {
  ONGOING = "ONGOING",
  ASSIGNED = "ASSIGNED",
}
