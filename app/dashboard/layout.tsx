"use client";
import DashboardLayout from "@/components/templates/pages/dashboard-layout/dashboard-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
