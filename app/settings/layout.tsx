"use client";
import SettingsLayout from "@/components/templates/layouts/settings-layout/settings-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
