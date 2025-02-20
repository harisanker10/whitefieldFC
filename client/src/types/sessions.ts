export type Session = {
  id: string;
  coachId: string | undefined;
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
