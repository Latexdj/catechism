"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, ScrollText, Search, LogOut } from "lucide-react";
import { useEffect, useRef } from "react";

const moreItems = [
  { href: "/classes",      label: "Classes & Cohorts", icon: BookOpen },
  { href: "/certificates", label: "Certificates",      icon: ScrollText },
  { href: "/reports",      label: "Reports & Search",  icon: Search },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MoreSheet({ open, onClose }: Props) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Close when route actually changes
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-16 z-50 bg-white rounded-t-3xl shadow-2xl lg:hidden transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <p className="px-6 pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
          More
        </p>

        <div className="px-4 pb-4 space-y-1">
          {moreItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="mx-4 border-t border-gray-100 pt-2 pb-6">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
