"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate } from "@/lib/utils";
import { Plus, Search, Droplets, Flame, Eye } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  address?: string;
  contactNumber?: string;
  baptism: { id: string } | null;
  confirmation: { id: string } | null;
  classMembers: Array<{ class: { name: string; year: number } }>;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/students?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => { setStudents(data); setLoading(false); });
  }, [search]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Students"
        subtitle={`${students.length} registered student${students.length !== 1 ? "s" : ""}`}
        actions={
          <Link
            href="/students/new"
            className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5f8a] transition-colors"
          >
            <Plus size={16} /> Add Student
          </Link>
        }
      />

      <div className="p-8">
        <div className="mb-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date of Birth</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Class</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600">Sacraments</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              )}
              {!loading && students.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No students found.</td></tr>
              )}
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{fullName(s)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(s.dateOfBirth)}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {s.classMembers[0]
                      ? `${s.classMembers[0].class.name} (${s.classMembers[0].class.year})`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <span title="Baptism" className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.baptism ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-400"}`}>
                        <Droplets size={12} /> Baptism
                      </span>
                      <span title="Confirmation" className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.confirmation ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
                        <Flame size={12} /> Confirmation
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/students/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium"
                    >
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
