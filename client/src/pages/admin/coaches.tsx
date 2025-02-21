import { useEffect, useState } from "react";
import { $api } from "@/http/api";
import { CreateCoachButton } from "@/components/coaches/createCoachButton";
import { CoachTable } from "@/components/coaches/coachTable";
import { Loader2 } from "lucide-react";

export function CoachesPage() {
  const [coaches, setCoaches] = useState<
    { name: string; email: string; id: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchCoaches = () => {
    setLoading(true);
    $api("coaches", { method: "GET" }).then((coaches) => {
      coaches && setCoaches(coaches);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchCoaches();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!coaches) {
    return <div className="w-full text-center p-10">No coaches added</div>;
  }

  return (
    <>
      <div className="w-full flex justify-end">
        <CreateCoachButton onSuccess={() => fetchCoaches()} />
      </div>
      <CoachTable coaches={coaches} />
    </>
  );
}
