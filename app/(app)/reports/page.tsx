"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { Search, Download, Droplets, Flame } from "lucide-react";

type FilterType = "all" | "baptism" | "confirmation" | "pending-notification";

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

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [baptisms, setBaptisms] = useState<BaptismRecord[]>([]);
  const [confirmations, setConfirmations] = useState<ConfirmationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/baptism?search=${encodeURIComponent(search)}`).then((r) => r.json()),
      fetch(`/api/confirmation?search=${encodeURIComponent(search)}`).then((r) => r.json()),
    ]).then(([b, c]) => {
      setBaptisms(b);
      setConfirmations(c);
      setLoading(false);
    });
  }, [search]);

  const showBaptisms = filter === "all" || filter === "baptism";
  const showConfirmations = filter === "all" || filter === "confirmation" || filter === "pending-notification";
  const filteredConfirmations = filter === "pending-notification"
    ? confirmations.filter((c) => c.notificationStatus === "PENDING")
    : confirmations;

  function exportCSV() {
    const rows: string[][] = [["Type", "Register Ref", "Name", "Date", "Place", "Minister/Bishop"]];
    if (showBaptisms) {
      baptisms.forEach((r) => {
        rows.push([
          "Baptism",
          formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber),
          fullName(r.student),
          formatDate(r.dateOfBaptism),
          r.placeOfBaptism,
          r.minister,
        ]);
      });
    }
    if (showConfirmations) {
      filteredConfirmations.forEach((r) => {
        rows.push([
          "Confirmation",
          formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber),
          fullName(r.student),
          formatDate(r.dateOfConfirmation),
          r.placeOfConfirmation,
          r.confirmingBishop,
        ]);
      });
    }
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parish-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filterButtons: { label: string; value: FilterType; color: string }[] = [
    { label: "All Records", value: "all", color: "bg-gray-100 text-gray-700" },
    { label: "Baptisms", value: "baptism", color: "bg-indigo-100 text-indigo-700" },
    { label: "Confirmations", value: "confirmation", color: "bg-amber-100 text-amber-700" },
    { label: "Pending Notification", value: "pending-notification", color: "bg-yellow-100 text-yellow-700" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Reports & Search"
        subtitle="Search and export sacramental records"
        actions={
          <button onClick={exportCSV} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        }
      />
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, place, minister..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map(({ label, value, color }) => (
              <button key={value} onClick={() => setFilter(value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === value ? `${color} ring-2 ring-offset-1 ring-current` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-gray-400 text-sm">Searching...</p>}

        {!loading && showBaptisms && baptisms.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Droplets size={16} className="text-indigo-600" />
              <h2 className="font-semibold text-[#1e3a5f]">Baptism Records ({baptisms.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Register Ref.</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Place</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Minister</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {baptisms.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs text-indigo-700 font-mono">{formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}</td>
                    <td className="px-6 py-3 font-medium"><Link href={`/students/${r.student.id}`} className="text-[#1e3a5f] hover:underline">{fullName(r.student)}</Link></td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(r.dateOfBaptism)}</td>
                    <td className="px-6 py-3 text-gray-500">{r.placeOfBaptism}</td>
                    <td className="px-6 py-3 text-gray-500">{r.minister}</td>
                    <td className="px-6 py-3 text-center">
                      <Link href={`/certificates?type=baptism&id=${r.id}`} className="text-xs text-indigo-600 hover:underline font-medium">Print</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && showConfirmations && filteredConfirmations.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Flame size={16} className="text-amber-600" />
              <h2 className="font-semibold text-[#1e3a5f]">
                {filter === "pending-notification" ? "Pending Notifications" : "Confirmation Records"} ({filteredConfirmations.length})
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Register Ref.</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Bishop</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Baptismal Parish</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600">Notification</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-600">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredConfirmations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs text-amber-700 font-mono">{formatRegisterRef(r.registerBook.bookNumber, r.registerBook.pageNumber, r.registerBook.entryNumber)}</td>
                    <td className="px-6 py-3 font-medium"><Link href={`/students/${r.student.id}`} className="text-[#1e3a5f] hover:underline">{fullName(r.student)}</Link></td>
                    <td className="px-6 py-3 text-gray-500">{formatDate(r.dateOfConfirmation)}</td>
                    <td className="px-6 py-3 text-gray-500">{r.confirmingBishop}</td>
                    <td className="px-6 py-3 text-gray-500">{r.confirmationSaintName}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.notificationStatus === "SENT" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {r.notificationStatus === "SENT" ? "Sent" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Link href={`/certificates?type=confirmation&id=${r.id}`} className="text-xs text-amber-600 hover:underline font-medium">Print</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && baptisms.length === 0 && confirmations.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>No records match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
