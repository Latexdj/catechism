"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { formatDate, fullName, formatRegisterRef } from "@/lib/utils";
import { Users, Droplets, Flame, BookOpen, Bell } from "lucide-react";

interface DashboardData {
  stats: {
    totalStudents: number;
    totalBaptisms: number;
    totalConfirmations: number;
    totalClasses: number;
    pendingNotifications: number;
  };
  recentBaptisms: Array<{
    id: string;
    dateOfBaptism: string;
    placeOfBaptism: string;
    student: { firstName: string; middleName?: string; lastName: string };
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  }>;
  recentConfirmations: Array<{
    id: string;
    dateOfConfirmation: string;
    placeOfConfirmation: string;
    notificationStatus: string;
    student: { firstName: string; middleName?: string; lastName: string };
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  }>;
}

const statCards = [
  { key: "totalStudents", label: "Students", icon: Users, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "totalBaptisms", label: "Baptisms", icon: Droplets, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { key: "totalConfirmations", label: "Confirmations", icon: Flame, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "totalClasses", label: "Active Classes", icon: BookOpen, color: "bg-green-50 text-green-700 border-green-200" },
  { key: "pendingNotifications", label: "Pending Notifications", icon: Bell, color: "bg-red-50 text-red-700 border-red-200" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" subtitle="Overview of parish sacramental records" />

      <div className="p-4 sm:p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className={`border rounded-xl p-5 flex flex-col gap-2 ${color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</span>
                <Icon size={18} className="opacity-60" />
              </div>
              <span className="text-3xl font-bold">
                {data.stats[key as keyof typeof data.stats]}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Baptisms */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Droplets size={16} className="text-indigo-600" />
              <h2 className="font-semibold text-[#1e3a5f]">Recent Baptisms</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {data.recentBaptisms.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-400">No records yet.</p>
              )}
              {data.recentBaptisms.map((r) => (
                <div key={r.id} className="px-6 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{fullName(r.student)}</p>
                    <p className="text-xs text-gray-400">{r.placeOfBaptism}</p>
                    <p className="text-xs text-gray-400">
                      {formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(r.dateOfBaptism)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Confirmations */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Flame size={16} className="text-amber-600" />
              <h2 className="font-semibold text-[#1e3a5f]">Recent Confirmations</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {data.recentConfirmations.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-400">No records yet.</p>
              )}
              {data.recentConfirmations.map((r) => (
                <div key={r.id} className="px-6 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{fullName(r.student)}</p>
                    <p className="text-xs text-gray-400">{r.placeOfConfirmation}</p>
                    <p className="text-xs text-gray-400">
                      {formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(r.dateOfConfirmation)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.notificationStatus === "SENT" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.notificationStatus === "SENT" ? "Notified" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
