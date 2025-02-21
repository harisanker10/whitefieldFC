import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Session } from "@/types/sessions";
import { UpdateCoachButton } from "./updateCoachButton";
import { MarkAttendanceButton } from "./markAttendanceButton";

export function SessionsTable({
  sessions,
  date,
}: {
  sessions: Session[];
  date: Date;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Slot</TableHead>
          <TableHead>Coach</TableHead>
          <TableHead>Attendance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium min-w-52">
              {format(new Date(session.startTime), "hh:mm a")} -{" "}
              {format(new Date(session.endTime), "hh:mm a")}
            </TableCell>
            <TableCell className="flex gap-2 items-center">
              {session?.coach?.name ?? (
                <span key={session?.coach?.id || i} className="text-yellow-400">
                  unassigned
                </span>
              )}
              <UpdateCoachButton session={session} />
            </TableCell>
            <TableCell>
              {session?.coach?.id ? (
                <MarkAttendanceButton session={session} date={date} />
              ) : (
                <span className="text-yellow-400 italic">
                  Assign coach to mark attendance
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}
