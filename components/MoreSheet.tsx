"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, ScrollText, Search, LogOut, X } from "lucide-react";
import { useEffect } from "react";

const moreItems = [
  { href: "/classes", label: "Classes & Cohorts", icon: BookOpen },
  { href: "/certificates", label: "Certificates", icon: ScrollText },
  { href: "/reports", label: "Reports & Search", icon: Search },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MoreSheet({ open, onClose }: Props) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { onClose(); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-semibold text-[#1e3a5f] text-sm">More</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-3 space-y-1">
          {moreItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#c9a84c]/10 text-[#1e3a5f]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} className={active ? "text-[#c9a84c]" : "text-gray-400"} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5 pt-1 border-t border-gray-100 mt-1">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
