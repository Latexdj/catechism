"use client";

import { useSession } from "next-auth/react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm no-print">
      <div>
        <h1 className="text-xl font-bold text-[#1e3a5f]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
          <p className="text-xs text-gray-400">
            {(session?.user as { role?: string })?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
