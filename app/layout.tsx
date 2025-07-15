import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootPage from "@/components/templates/pages/root-page/root-page";
import ClientProviders from "@/components/client-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mivoden Activities",
  description:
    "Used for managing and printing activity signups for Camp Mivoden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <RootPage>{children}</RootPage>
        </ClientProviders>
      </body>
    </html>
  );
}
