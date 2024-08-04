"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { dayid: rawDayId } = params;
  const dayId = typeof rawDayId === 'string' ? rawDayId : rawDayId[0];
  
  return (
    <div>Day: {dayId}</div>
  );
}
