"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import MoreSheet from "./MoreSheet";

const primaryItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12L11.204 3.045a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: "/students",
    label: "Students",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    href: "/baptism",
    label: "Baptism",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M6.343 6.343l-1.06 1.06M3 12H1.5M6.343 17.657l-1.06-1.06M12 21v-1.5M17.657 17.657l1.06-1.06M21 12h-1.5M17.657 6.343l1.06 1.06M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/confirmation",
    label: "Confirm",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

const moreHrefs = ["/classes", "/certificates", "/reports"];

export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const moreActive = moreHrefs.some((h) => pathname.startsWith(h));

  return (
    <>
      <MoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-gray-200 flex items-stretch h-16 safe-area-pb">
        {primaryItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            >
              <span className={active ? "text-[#1e3a5f]" : "text-gray-400"}>
                {icon(active)}
              </span>
              <span className={`text-[9px] font-semibold tracking-wide ${active ? "text-[#1e3a5f]" : "text-gray-400"}`}>
                {label.toUpperCase()}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1e3a5f] rounded-b-full" />
              )}
            </Link>
          );
        })}

        <button
          onClick={() => setSheetOpen((v) => !v)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
        >
          <span className={moreActive || sheetOpen ? "text-[#1e3a5f]" : "text-gray-400"}>
            <MoreHorizontal size={24} strokeWidth={moreActive || sheetOpen ? 2.5 : 1.5} />
          </span>
          <span className={`text-[9px] font-semibold tracking-wide ${moreActive || sheetOpen ? "text-[#1e3a5f]" : "text-gray-400"}`}>
            MORE
          </span>
          {(moreActive || sheetOpen) && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1e3a5f] rounded-b-full" />
          )}
        </button>
      </nav>
    </>
  );
}
