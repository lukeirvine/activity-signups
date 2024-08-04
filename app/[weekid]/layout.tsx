"use client";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import { useReadDoc } from "@/hooks/use-firebase";
import { useParams, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { weekid: rawWeekId } = params;
  const weekId = typeof rawWeekId === 'string' ? rawWeekId : rawWeekId[0];


  const { data: week, loading: weekLoading } = useReadDoc({ collectionId: 'weeks', docId: weekId });

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        <div>
          {week && <div className="prose">
            <h1>{week.name}</h1>
          </div>}
          {week === undefined && <div className="prose">
            <h1>Week Not Found</h1>
          </div>}
          {weekLoading && <div className="skeleton w-full max-w-xs h-10"></div>}
        </div>
        <TabNav />
      </div>
      {children}
    </PageContainer>
  )
}