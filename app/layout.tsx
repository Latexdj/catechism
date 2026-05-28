import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Parish Catechism Records",
  description: "Roman Catholic Parish Sacramental Records Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#f8f7f4]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
