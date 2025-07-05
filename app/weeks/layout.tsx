"use client";
import WeeksLayout from "@/components/templates/layouts/weeks-layout/weeks-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WeeksLayout>{children}</WeeksLayout>;
}
