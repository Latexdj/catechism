"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Droplets,
  Flame,
  MoreHorizontal,
} from "lucide-react";
import MoreSheet from "./MoreSheet";

const primaryItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/baptism", label: "Baptism", icon: Droplets },
  { href: "/confirmation", label: "Confirmation", icon: Flame },
];

const moreHrefs = ["/classes", "/certificates", "/reports"];

export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const moreActive = moreHrefs.some((h) => pathname.startsWith(h));

  return (
    <>
      <MoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex lg:hidden">
        {primaryItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors"
            >
              <Icon
                size={22}
                className={active ? "text-[#c9a84c]" : "text-gray-400"}
              />
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? "text-[#c9a84c]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#c9a84c] rounded-t-full" />
              )}
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setSheetOpen((v) => !v)}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors relative"
        >
          <MoreHorizontal
            size={22}
            className={moreActive || sheetOpen ? "text-[#c9a84c]" : "text-gray-400"}
          />
          <span
            className={`text-[10px] font-medium leading-none ${
              moreActive || sheetOpen ? "text-[#c9a84c]" : "text-gray-400"
            }`}
          >
            More
          </span>
          {(moreActive || sheetOpen) && (
            <span className="absolute bottom-0 w-8 h-0.5 bg-[#c9a84c] rounded-t-full" />
          )}
        </button>
      </nav>
    </>
  );
}
