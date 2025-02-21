import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import { DatePickerButton } from "@/components/custom/datePicker";
import { format } from "date-fns";
import { CreateSessionButton } from "@/components/admin/sessions/createSessionButton";
import { SessionsTable } from "@/components/admin/sessions/sessionsTable";
import { Loader2 } from "lucide-react";

export function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchSessions = () => {
    setLoading(true);
    const formattedDate = format(date, "yyyy-MM-dd");

    $api(`sessions?day=${formattedDate}`, { method: "GET" }).then((data) => {
      data && setSessions(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSessions();
  }, [date]);

  return (
    <>
      <div className="w-full flex justify-between">
        <DatePickerButton value={date} onChange={(date) => setDate(date)} />
        <CreateSessionButton
          initialDate={new Date(date)}
          onSuccess={() => {
            fetchSessions();
          }}
        />
      </div>

      {loading ? (
        <div className="w-full flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : sessions.length ? (
        <SessionsTable sessions={sessions} date={date} />
      ) : (
        <div className="w-full text-center p-10">
          There are no sessions for this day.
        </div>
      )}
    </>
  );
}
