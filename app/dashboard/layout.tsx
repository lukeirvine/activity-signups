"use client";
import DashboardPage from "@/components/templates/pages/dashboard-page/dashboard-page";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardPage>{children}</DashboardPage>;
}
