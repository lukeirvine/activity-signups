"use client";
import { useReadDoc } from "@/hooks/use-firebase";
import { useParams, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { weekid: rawWeekId } = params;
  const weekId = typeof rawWeekId === 'string' ? rawWeekId : rawWeekId[0];


  const { data: week, loading: weekLoading } = useReadDoc({ collectionId: 'weeks', docId: weekId });

  return (
    <div>
      {week && <div className="prose">
        <h1>{week.name}</h1>
      </div>}
      {children}
    </div>
  )
}