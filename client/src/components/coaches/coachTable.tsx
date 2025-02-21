import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";

export function CoachTable({
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
