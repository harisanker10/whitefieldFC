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
import { Loader2, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/sessions";

export function MarkAttendanceButton({
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
        coachId: session?.coach?.id,
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
