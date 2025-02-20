import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useRoutes } from "react-router";

export function CoachesPage() {
  const [coaches, setCoaches] = useState<
    { name: string; email: string; id: string }[]
  >([]);
  useEffect(() => {
    $api("coaches", { method: "GET" }).then(
      (coaches) => coaches && setCoaches(coaches),
    );
  }, []);

  if (!coaches) {
    return <div className="w-full text-center p-10">No coaches added</div>;
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <CreateCoachButton />
      </div>
      <CoachTable coaches={coaches} />
    </>
  );
}

function CoachTable({
  coaches,
}: {
  coaches: { name: string; email: string; id: string }[];
}) {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-background">
          <TableHead className="w-52">Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coaches.map((coach, i) => (
          <TableRow
            className="cursor-pointer"
            key={i}
            onClick={() => {
              navigate(`/admin/coaches/performance/${coach.id}`);
            }}
          >
            <TableCell className="font-medium">{coach.name}</TableCell>
            <TableCell>{coach.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CreateCoachButton({ buttonClassName }: { buttonClassName?: string }) {
  const [values, setValues] = useState({ name: "", email: "" });
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { toast } = useToast();
  const createCoach = async () => {
    return $api("coaches", {
      method: "POST",
      body: { name: values.name, email: values.email },
    }).then((data) => {
      console.log({ data });
      data
        ? toast({
            title: "Successful",
            description: "Added coach successfully.",
          })
        : toast({
            title: "Failed",
            description: "Something went wrong.",
            variant: "destructive",
          });
      setDialogIsOpen(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
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
            Create Coach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
