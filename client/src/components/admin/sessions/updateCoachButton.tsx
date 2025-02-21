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
import { Loader2, Pencil, User } from "lucide-react";
import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Session } from "@/types/sessions";

export function UpdateCoachButton({ session }: { session: Session }) {
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
