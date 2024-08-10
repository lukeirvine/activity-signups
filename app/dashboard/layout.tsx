import RootPage from "@/components/templates/pages/root-page/root-page";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootPage>{children}</RootPage>;
}
