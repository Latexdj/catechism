"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ImportPanel from "@/components/ImportPanel";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { Plus, Upload, Search, Eye, Printer } from "lucide-react";

interface BaptismRecord {
  id: string;
  dateOfBaptism: string;
  placeOfBaptism: string;
  minister: string;
  godfatherName: string;
  godmotherName: string;
  student: { id: string; firstName: string; middleName?: string; lastName: string };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

export default function BaptismPage() {
  const [records, setRecords] = useState<BaptismRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);

  const loadRecords = useCallback(() => {
    setLoading(true);
    fetch(`/api/baptism?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false); });
  }, [search]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Baptism Records"
        subtitle={`${records.length} record${records.length !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportOpen(true)}
              className="flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Upload size={15} /> Upload Records
            </button>
            <Link
              href="/baptism/new"
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5f8a] transition-colors"
            >
              <Plus size={16} /> New Record
            </Link>
          </div>
        }
      />

      <ImportPanel
        type="baptism"
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={loadRecords}
      />

      <div className="p-4 sm:p-8">
        <div className="mb-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, minister, or place..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Register Ref.</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date of Baptism</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 hidden md:table-cell">Place</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 hidden md:table-cell">Minister</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 hidden lg:table-cell">Godparents</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>}
              {!loading && records.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No baptism records found.</td></tr>}
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-xs text-indigo-700 font-mono">
                    {formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <Link href={`/students/${r.student.id}`} className="hover:underline text-[#1e3a5f]">
                      {fullName(r.student)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(r.dateOfBaptism)}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{r.placeOfBaptism}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{r.minister}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {r.godfatherName} / {r.godmotherName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/baptism/${r.id}`} className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium">
                        <Eye size={14} /> View
                      </Link>
                      <Link href={`/students/${r.student.id}/baptismal-card?print=1`} className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                        <Printer size={14} /> Print Card
                      </Link>
                    </div>
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
