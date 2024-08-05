"use client";
import DayPage from "@/components/templates/pages/day-page/day-page";
import { convertDateToDay } from "@/helpers/utils";
import { useReadDoc } from "@/hooks/use-firebase";
import { Day } from "@/types/firebase-types";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { dayid, weekid } = params;
  const dayId = typeof dayid === "string" ? dayid : dayid[0];

  const { data: day, loading: dayLoading } = useReadDoc<Day>({ collectionId: `weeks/${weekid}/days`, docId: dayId });
  
  return <DayPage />;
}
