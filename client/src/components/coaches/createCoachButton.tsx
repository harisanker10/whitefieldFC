import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { $api } from "@/http/api";
import { useToast } from "@/hooks/use-toast";
import { Coach } from "@/types/coach";

export function CreateCoachButton({
  buttonClassName,
  onSuccess,
  onFailure,
}: {
  buttonClassName?: string;
  onSuccess?: (data: Coach) => void;
  onFailure?: () => void;
}) {
  const [values, setValues] = useState({ name: "", email: "" });
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [createCoachLoading, setCreateCoachLoading] = useState(false);
  const { toast } = useToast();
  const createCoach = async () => {
    setCreateCoachLoading(true);
    return $api("coaches", {
      method: "POST",
      body: { name: values.name, email: values.email },
    }).then((data) => {
      setCreateCoachLoading(false);
      if (data) {
        toast({
          title: "Successful",
          description: "Added coach successfully.",
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
      setDialogIsOpen(false);
    });
  };
  return (
    <Dialog
      open={dialogIsOpen}
      onOpenChange={(isOpen) => setDialogIsOpen(isOpen)}
    >
      <DialogTrigger asChild>
        <Button variant="default" className={buttonClassName}>
          <Plus />
          Add Coach
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Coach</DialogTitle>
          <DialogDescription>This will create a new Coach.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-4 w-full">
          <div className="items-center gap-4">
            <Input
              id="name"
              className="w-full"
              value={values.name && values.name}
              onChange={(elt) =>
                setValues({ ...values, name: elt.target.value })
              }
              placeholder="Name"
              name="name"
            />
          </div>
          <div className="items-center gap-4">
            <Input
              id="email"
              name="email"
              value={values.email && values.email}
              onChange={(elt) =>
                setValues({ ...values, email: elt.target.value })
              }
              placeholder="Email"
              type="email"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={createCoach}>
            {createCoachLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Coach"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
