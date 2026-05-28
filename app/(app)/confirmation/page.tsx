"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { Plus, Search, Eye, Bell } from "lucide-react";

interface ConfirmationRecord {
  id: string;
  dateOfConfirmation: string;
  placeOfConfirmation: string;
  confirmingBishop: string;
  sponsorName: string;
  confirmationSaintName: string;
  notificationStatus: string;
  student: { id: string; firstName: string; middleName?: string; lastName: string };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

export default function ConfirmationPage() {
  const [records, setRecords] = useState<ConfirmationRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/confirmation?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false); });
  }, [search]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Confirmation Records"
        subtitle={`${records.length} record${records.length !== 1 ? "s" : ""}`}
        actions={
          <Link href="/confirmation/new" className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5f8a] transition-colors">
            <Plus size={16} /> New Record
          </Link>
        }
      />
      <div className="p-8">
        <div className="mb-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, bishop, or parish..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Register Ref.</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Bishop</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Saint Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Sponsor</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Notification</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>}
              {!loading && records.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">No confirmation records found.</td></tr>}
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-xs text-amber-700 font-mono">
                    {formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    <Link href={`/students/${r.student.id}`} className="text-[#1e3a5f] hover:underline">{fullName(r.student)}</Link>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(r.dateOfConfirmation)}</td>
                  <td className="px-5 py-4 text-gray-500">{r.confirmingBishop}</td>
                  <td className="px-5 py-4 text-gray-500 italic">{r.confirmationSaintName}</td>
                  <td className="px-5 py-4 text-gray-500">{r.sponsorName}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${r.notificationStatus === "SENT" ? "bg-green-100 text-green-700" : r.notificationStatus === "NOT_REQUIRED" ? "bg-gray-100 text-gray-500" : "bg-yellow-100 text-yellow-700"}`}>
                      <Bell size={11} />
                      {r.notificationStatus === "SENT" ? "Sent" : r.notificationStatus === "NOT_REQUIRED" ? "N/A" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link href={`/confirmation/${r.id}`} className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
