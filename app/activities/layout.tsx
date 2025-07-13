"use client";

import { Suspense } from "react";
import FullPageLoading from "@/components/atoms/full-page-loading/full-page-loading";
import ActivitiesLayout from "@/components/templates/layouts/activities-layout/activities-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <ActivitiesLayout>{children}</ActivitiesLayout>
    </Suspense>
  );
}
