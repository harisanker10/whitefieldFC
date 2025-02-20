import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { $api } from "@/http/api";
import { Attendance, AttendanceStatus } from "@/types/attendances";
import { Session } from "@/types/sessions";
import {
  CalendarCheck,
  Clock,
  Table,
  Timer,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export function PerformancePage() {
  const { coachId } = useParams();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    $api(`sessions?coachId=${coachId}`, { method: "GET" }).then(
      (data) => data && setSessions(data),
    );
    $api(`attendances?coachId=${coachId}`, { method: "GET" }).then(
      (data) => data && setAttendances(data),
    );
  }, [coachId]);

  if (attendances || sessions) console.log({ attendances, sessions });

  return (
    <div className="p-8 w-full">
      <div className="flex gap-2 w-full">
        <AttendanceCard attendances={attendances} />
        <PunctualityCard attendances={attendances} />
      </div>
    </div>
  );
}

function AttendanceCard({ attendances }: { attendances: Attendance[] }) {
  const totalPresent = attendances.filter(
    (att) => att.status === AttendanceStatus.ATTENDED,
  ).length;
  const totalAbsent = attendances.filter(
    (att) => att.status === AttendanceStatus.ABSENT,
  ).length;
  const totalAssigned = attendances.length;
  const totalPercentage = (totalPresent / totalAssigned) * 100;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">Attendance </CardTitle>
        <CalendarCheck className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <AttendanceStatItem
            icon={<UserCheck className="h-4 w-4" />}
            label="Present"
            value={totalPresent}
            color="text-green-600"
          />
          <AttendanceStatItem
            icon={<UserX className="h-4 w-4" />}
            label="Absent"
            value={totalAbsent}
            color="text-red-600"
          />
          <AttendanceStatItem
            icon={<Users className="h-4 w-4" />}
            label="Total"
            value={totalAssigned}
            color="text-blue-600"
          />
        </div>
        {!isNaN(totalPercentage) && (
          <>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(totalPresent / totalAssigned) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {totalPercentage.toFixed(1)}% Attendance Rate
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AttendanceStatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${color} bg-opacity-10 mb-2`}
      >
        {icon}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function PunctualityCard({ attendances }: { attendances: Attendance[] }) {
  const totalLate = attendances.reduce(
    (acc, curr) => acc + (curr.lateInMinutes || 0),
    0,
  );
  const totalLateCount = attendances.filter(
    (att) => att.lateInMinutes && att.lateInMinutes > 0,
  ).length;

  const averageLateTime =
    totalLateCount > 0 ? (totalLate / totalLateCount).toFixed(0) : "0";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Punctuality</CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="w-full mt-8 flex items-center justify-evenly">
          <PunctualityStatItem
            icon={<Timer className="h-4 w-4" />}
            label="Avg. Late Time"
            value={`${averageLateTime} min`}
            color="text-yellow-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PunctualityStatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-2 mb-4 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}
