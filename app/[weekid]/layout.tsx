"use client";
import PageContainer from "@/components/atoms/containers/page-container/page-container";
import TabNav from "@/components/organisms/nav/tab-nav/tab-nav";
import WeekLayout from "@/components/templates/layouts/week-layout/week-layout";
import { useReadDoc } from "@/hooks/use-firebase";
import { useParams, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WeekLayout>
      {children}
    </WeekLayout>
  )
}