"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { fullName, formatDate } from "@/lib/utils";
import { Users, Droplets, Flame, Plus, X } from "lucide-react";

interface ClassDetail {
  id: string;
  name: string;
  year: number;
  sacramentType: string;
  catechist?: string;
  description?: string;
  isActive: boolean;
  members: Array<{
    id: string;
    student: {
      id: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      dateOfBirth: string;
      baptism: { id: string } | null;
      confirmation: { id: string } | null;
    };
  }>;
}

interface Student { id: string; firstName: string; middleName?: string; lastName: string }

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [cls, setCls] = useState<ClassDetail | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [adding, setAdding] = useState(false);

  const reload = () => fetch(`/api/classes/${id}`).then((r) => r.json()).then(setCls);

  useEffect(() => { reload(); fetch("/api/students").then((r) => r.json()).then(setAllStudents); }, [id]);

  async function addMember() {
    if (!selectedStudentId) return;
    setAdding(true);
    await fetch(`/api/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addMember", studentId: selectedStudentId }),
    });
    setSelectedStudentId("");
    setShowAdd(false);
    setAdding(false);
    reload();
  }

  async function removeMember(studentId: string) {
    if (!confirm("Remove this student from the class?")) return;
    await fetch(`/api/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeMember", studentId }),
    });
    reload();
  }

  if (!cls) return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const memberIds = new Set(cls.members.map((m) => m.student.id));
  const availableStudents = allStudents.filter((s) => !memberIds.has(s.id));

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={cls.name}
        subtitle={`${cls.year} · ${cls.sacramentType} · ${cls.members.length} student${cls.members.length !== 1 ? "s" : ""}`}
      />
      <div className="p-4 sm:p-8 space-y-6">
        {/* Class Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-xs text-gray-400 uppercase tracking-wide block">Catechist</span><span className="font-medium text-gray-700">{cls.catechist || "—"}</span></div>
          <div><span className="text-xs text-gray-400 uppercase tracking-wide block">Year</span><span className="font-medium text-gray-700">{cls.year}</span></div>
          <div><span className="text-xs text-gray-400 uppercase tracking-wide block">Sacrament</span><span className="font-medium text-gray-700">{cls.sacramentType}</span></div>
          <div><span className="text-xs text-gray-400 uppercase tracking-wide block">Status</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{cls.isActive ? "Active" : "Archived"}</span></div>
          {cls.description && <div className="col-span-full"><span className="text-xs text-gray-400 uppercase tracking-wide block">Description</span><span className="text-gray-600">{cls.description}</span></div>}
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#1e3a5f]" />
              <h2 className="font-semibold text-[#1e3a5f]">Students ({cls.members.length})</h2>
            </div>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:underline font-medium">
              <Plus size={15} /> Add Student
            </button>
          </div>

          {showAdd && (
            <div className="px-6 py-4 border-b border-gray-100 bg-blue-50 flex items-center gap-3">
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                <option value="">— Select student to add —</option>
                {availableStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.lastName}, {s.firstName}{s.middleName ? ` ${s.middleName}` : ""}</option>
                ))}
              </select>
              <button onClick={addMember} disabled={!selectedStudentId || adding} className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                {adding ? "Adding..." : "Add"}
              </button>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
          )}

          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Date of Birth</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600">Baptism</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600">Confirmation</th>
                <th className="text-center px-6 py-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cls.members.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No students yet.</td></tr>}
              {cls.members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{fullName(m.student)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(m.student.dateOfBirth)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${m.student.baptism ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-400"}`}>
                      <Droplets size={11} /> {m.student.baptism ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${m.student.confirmation ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
                      <Flame size={11} /> {m.student.confirmation ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => removeMember(m.student.id)} className="text-red-400 hover:text-red-600">
                      <X size={15} />
                    </button>
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
