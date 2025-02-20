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
import { Loader, Loader2, Plus, User } from "lucide-react";
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

export function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    $api(`sessions/${formattedDate}`, { method: "GET" }).then((data) => {
      console.log({ data });
      data && setSessions(data);
    });
  }, [date]);

  return (
    <>
      <div className="w-full flex justify-between">
        <DatePickerButton value={date} onChange={(date) => setDate(date)} />
        <CreateSessionButton />
      </div>
      {sessions.length ? (
        <SessionsTable sessions={sessions} />
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
}: {
  sessions: {
    startTime: Date;
    endTime: Date;
    coach: { name: string; id: string };
    status: string;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Slot</TableHead>
          <TableHead>Coach</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium min-w-52">
              {format(new Date(session.startTime), "hh:mm a")} -{" "}
              {format(new Date(session.endTime), "hh:mm a")}
            </TableCell>
            <TableCell>
              {session?.coach?.name ?? (
                <span key={session?.coach?.id || i} className="text-yellow-400">
                  unassigned
                </span>
              )}
            </TableCell>
            <TableCell>{session?.status || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export function CreateSessionButton() {
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [date, setDate] = useState(new Date());
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
