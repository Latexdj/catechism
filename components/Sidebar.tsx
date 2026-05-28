"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Droplets,
  Flame,
  BookOpen,
  ScrollText,
  Search,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/baptism", label: "Baptism Records", icon: Droplets },
  { href: "/confirmation", label: "Confirmation Records", icon: Flame },
  { href: "/classes", label: "Classes & Cohorts", icon: BookOpen },
  { href: "/certificates", label: "Certificates", icon: ScrollText },
  { href: "/reports", label: "Reports & Search", icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#1e3a5f] text-white shadow-xl">
      <div className="px-6 py-6 border-b border-blue-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#c9a84c] text-2xl">✝</span>
          <span className="font-bold text-lg tracking-wide">Parish Records</span>
        </div>
        <p className="text-xs text-blue-300 ml-7">Catechism Management</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#c9a84c] text-[#1e3a5f] font-semibold shadow"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
