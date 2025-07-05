"use client";

import ActivitiesLayout from "@/components/templates/layouts/activities-layout/activities-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ActivitiesLayout>{children}</ActivitiesLayout>;
}
