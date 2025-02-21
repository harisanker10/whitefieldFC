import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader, Loader2, NotebookPen, Pencil, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/custom/timePicker";
import { Label } from "@/components/ui/label";
import { DatePickerButton } from "@/components/custom/datePicker";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  coach: { name: string; id: string };
  status: string;
}

export function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    $api(`sessions?day=${formattedDate}`, { method: "GET" }).then((data) => {
      console.log({ data });
      data && setSessions(data);
    });
  }, [date]);

  return (
    <>
      <div className="w-full flex justify-between">
        <DatePickerButton value={date} onChange={(date) => setDate(date)} />
        <CreateSessionButton initialDate={date} />
      </div>
      {sessions.length ? (
        <SessionsTable sessions={sessions} date={date} />
      ) : (
        <div className="w-full text-center p-10">
          There are no sessions for this day.
        </div>
      )}
    </>
  );
}

function SessionsTable({
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
                "elonma"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function CreateSessionButton({ initialDate }: { initialDate?: Date }) {
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [date, setDate] = useState(initialDate || new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [coachId, setCoachId] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    $api("coaches", { method: "GET" }).then((data) => data && setCoaches(data));
  }, []);

  const createSession = () => {
    console.log({ startTime, endTime });
    const start = new Date(date);
    start.setHours(startTime.getHours());
    start.setMinutes(startTime.getMinutes());
    start.setSeconds(0);
    start.setMilliseconds(0);

    const end = new Date(date);

    end.setHours(endTime.getHours());
    end.setMinutes(endTime.getMinutes());
    end.setSeconds(0);
    end.setMilliseconds(0);

    const body = {
      coachId: coachId === "unassigned" ? undefined : coachId,
      startTime: start,
      endTime: end,
    };

    $api("sessions", {
      method: "POST",
      body,
    }).then((data) => {
      if (data) {
        toast({
          title: "Successful",
          description: "Session created successfully",
        });
      } else {
        toast({
          title: "Failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
      setDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(isOpen) => setDialogOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Add Session
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Session</DialogTitle>
          <DialogDescription>This will create a new session.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="items-center gap-4">
            <Select
              onValueChange={(coachId) => {
                setCoachId(coachId);
              }}
              defaultValue={coachId && coachId}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <SelectValue placeholder="Coach" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {coaches.length ? (
                  coaches.map((coach) => (
                    <SelectItem value={coach.id}>{coach.name}</SelectItem>
                  ))
                ) : (
                  <Loader2 className="animate-spin w-4 h-4 my-4 mx-auto" />
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="items-center gap-4">
            <DatePickerButton
              value={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              buttonClassName="w-full px-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-20 pl-3">Start Time </Label>
            <TimePicker
              value={startTime}
              onChange={(time) => setStartTime(time)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="min-w-20 pl-3">End Time </Label>
            <TimePicker value={endTime} onChange={(time) => setEndTime(time)} />
          </div>
        </div>

        <span>
          Session Duration:{"   "}
          {Math.floor((endTime.getTime() - startTime.getTime()) / 60000)} min
        </span>
        <DialogFooter>
          <Button type="button" onClick={() => createSession()}>
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateCoachButton({ session }: { session: Session }) {
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState(session?.coach?.id);
  const [markAbsent, setMarkAbsent] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    $api("coaches", { method: "GET" }).then((data) => data && setCoaches(data));
  }, []);

  const updateCoach = (sessionId: string) => {
    $api(`sessions/coach/${sessionId}`, {
      method: "PATCH",
      body: { coachId: selectedCoachId, markAbsent },
    }).then((data) => {
      if (data) {
        toast({
          title: "Successful",
          description: "Updated Coach successfully.",
        });
        setDialogOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast({
          title: "Failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
        setDialogOpen(false);
      }
    });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="">
            <Pencil className="bg-transparent" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change coach</DialogTitle>
          <DialogDescription>Assign a different coach</DialogDescription>
        </DialogHeader>
        <div className="items-center gap-4 py-10">
          <Select
            onValueChange={(coachId) => {
              setSelectedCoachId(coachId);
            }}
            defaultValue={session?.coach?.id}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <SelectValue placeholder="Coach" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {coaches.length ? (
                coaches.map((coach) => (
                  <SelectItem value={coach.id}>{coach.name}</SelectItem>
                ))
              ) : (
                <Loader2 className="animate-spin w-4 h-4 my-4 mx-auto" />
              )}
            </SelectContent>
          </Select>
        </div>
        {session?.coach?.id && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`mark-absent-${session.coach.id}`}
              onCheckedChange={(checked) => setMarkAbsent(checked as boolean)}
            />
            <label
              htmlFor={`mark-absent-${session.coach.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark <span className="font-semibold">{session.coach.name}</span>{" "}
              as absent
            </label>
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            onClick={() => updateCoach(session.id)}
            disabled={selectedCoachId === session?.coach?.id}
          >
            Update Coach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MarkAttendanceButton({
  session,
  date,
}: {
  session: Session;
  date: Date;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendances, setAttendances] = useState<
    {
      coachId: string;
      sessionId: string;
      status: "ATTENDED" | "PENDING" | "ABSENT";
      attendedTime: Date;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [lateInMin, setLateInMin] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    $api(`attendances?sessionId=${session.id}`, { method: "GET" }).then(
      (data) => {
        console.log({ fetchedAttendance: data });
        data && setAttendances(data);
        setLoading(false);
      },
    );
  }, [date, session.id]);

  if (loading) {
    return <Loader2 className="w-3 h-3 animate-spin" />;
  }

  if (attendances.find((attendance) => attendance.status === "ATTENDED")) {
    return <span className="font-semibold text-green-400">Attended</span>;
  }

  const markAttendance = () => {
    $api(`attendances`, {
      method: "POST",
      body: {
        coachId: session.coach.id,
        sessionId: session.id,
        status: "ATTENDED",
        lateInMinutes: +lateInMin,
      },
    }).then((data) => {
      if (data) {
        toast({
          title: "Successful",
          description: "Session marked attendance.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast({
          title: "Failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <NotebookPen className="bg-transparent" /> Attendance
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            This will mark attendance for the coach {session?.coach?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="items-center gap-4 py-5">
          <Label htmlFor={`late-${session.id}`}>Late (In minutes)</Label>
          <Input
            type="number"
            id={`late-${session.id}`}
            defaultValue={0}
            onChange={(elt) => setLateInMin(+elt.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={markAttendance}>
            Mark Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
