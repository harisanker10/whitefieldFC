"use client";

import type React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { $api } from "@/http/api";
import { type Attendance, AttendanceStatus } from "@/types/attendances";
import type { Session } from "@/types/sessions";
import {
  CalendarCheck,
  Clock,
  Timer,
  UserCheck,
  Users,
  UserX,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router";

export function PerformancePage() {
  const { coachId } = useParams();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [coach, setCoach] = useState<{
    name: string;
    email: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    $api(`sessions?coachId=${coachId}`, { method: "GET" }).then(
      (data) => data && setSessions(data),
    );
    $api(`attendances?coachId=${coachId}`, { method: "GET" }).then(
      (data) => data && setAttendances(data),
    );
    $api(`coaches/${coachId}`, { method: "GET" }).then(
      (data) => data && setCoach(data),
    );
  }, [coachId]);

  return (
    <div className="p-8 w-full space-y-6">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AttendanceCard attendances={attendances} />
        <PunctualityCard attendances={attendances} />
        <SessionsCard sessions={sessions} coach={coach} />
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Attendance</CardTitle>
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
            <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${totalPercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
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
        className={`flex items-center justify-center w-12 h-12 rounded-full ${color} bg-opacity-10 mb-2`}
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

  const chartData = attendances
    .filter((att) => att.lateInMinutes && att.lateInMinutes > 0)
    .map((att, index) => ({
      session: index + 1,
      lateMinutes: att.lateInMinutes,
    }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Punctuality</CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="w-full mt-4 flex items-center justify-center">
          <PunctualityStatItem
            icon={<Timer className="h-4 w-4" />}
            label="Avg. Late Time"
            value={`${averageLateTime} min`}
            color="text-yellow-600"
          />
        </div>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="lateMinutes"
                stroke="#fbbf24"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
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
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

function SessionsCard({
  sessions,
  coach,
}: {
  sessions: Session[];
  coach: { name: string; email: string; id: string } | null;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Sessions</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {coach && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{coach.name}</h3>
            <p className="text-sm text-muted-foreground">{coach.email}</p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.slice(0, 5).map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {new Date(session.startTime).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(session.startTime).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {new Date(session.endTime).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sessions.length > 5 && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing 5 of {sessions.length} sessions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
