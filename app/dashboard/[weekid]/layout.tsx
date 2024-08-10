"use client";
import WeekLayout from "@/components/templates/layouts/week-layout/week-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WeekLayout>{children}</WeekLayout>;
}
