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
import { Loader2, Plus, User } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Session } from "@/types/sessions";

export function CreateSessionButton({
  initialDate = new Date(),
  onFailure,
  onSuccess,
}: {
  initialDate?: Date;
  onFailure?: () => void;
  onSuccess?: (data: Session) => void;
}) {
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([]);
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [coachId, setCoachId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    $api("coaches", { method: "GET" }).then((data) => data && setCoaches(data));
  }, []);

  const createSession = () => {
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

    setSubmissionLoading(true);

    $api("sessions", {
      method: "POST",
      body,
    }).then((data) => {
      setSubmissionLoading(false);
      if (data) {
        toast({
          title: "Successful",
          description: "Session created successfully",
        });
        onSuccess && onSuccess(data);
      } else {
        toast({
          title: "Failed",
          description: "Something went wrong.",
          variant: "destructive",
        });
        onFailure && onFailure();
      }

      setDialogOpen(false);
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
            {submissionLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Create Session"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
