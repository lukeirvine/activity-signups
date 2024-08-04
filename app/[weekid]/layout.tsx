"use client";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import WeekLayout from "@/components/templates/layouts/week-layout/week-layout";
import { useReadDoc } from "@/hooks/use-firebase";
import { useParams, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { weekid: rawWeekId } = params;
  const weekId = typeof rawWeekId === 'string' ? rawWeekId : rawWeekId[0];


  const { data: week, loading: weekLoading } = useReadDoc({ collectionId: 'weeks', docId: weekId });

  return (
    <WeekLayout>
      {children}
    </WeekLayout>
  )
}