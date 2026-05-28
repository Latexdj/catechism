"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Student { id: string; firstName: string; middleName?: string; lastName: string; baptism?: { registerBook: { bookNumber: number; pageNumber: number; entryNumber: number } } | null }

function NewConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId") || "";

  const [students, setStudents] = useState<Student[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: preselectedStudentId,
    dateOfConfirmation: "",
    placeOfConfirmation: "",
    diocese: "",
    confirmingBishop: "",
    sponsorName: "",
    confirmationSaintName: "",
    baptismalParish: "",
    baptismalBookRef: "",
    updateBaptismRecord: true,
  });

  useEffect(() => {
    fetch("/api/students").then((r) => r.json()).then(setStudents);
  }, []);

  // Auto-fill baptismal ref when student is selected
  useEffect(() => {
    const s = students.find((s) => s.id === form.studentId);
    if (s?.baptism?.registerBook) {
      const { bookNumber, pageNumber, entryNumber } = s.baptism.registerBook;
      setForm((f) => ({ ...f, baptismalBookRef: `Book ${bookNumber}, Page ${pageNumber}, Entry ${entryNumber}` }));
    }
  }, [form.studentId, students]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { setError("Failed to save. Please try again."); setSaving(false); return; }
    const data = await res.json();
    router.push(`/students/${data.student.id}`);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Student</h2>
        <div>
          <label className={labelClass}>Student <span className="text-red-500">*</span></label>
          <select value={form.studentId} onChange={set("studentId")} required className={inputClass}>
            <option value="">— Select student —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.lastName}, {s.firstName}{s.middleName ? ` ${s.middleName}` : ""}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Confirmation Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Date of Confirmation <span className="text-red-500">*</span></label><input type="date" value={form.dateOfConfirmation} onChange={set("dateOfConfirmation")} required className={inputClass} /></div>
          <div><label className={labelClass}>Place (Church) <span className="text-red-500">*</span></label><input type="text" value={form.placeOfConfirmation} onChange={set("placeOfConfirmation")} required className={inputClass} /></div>
          <div><label className={labelClass}>Diocese</label><input type="text" value={form.diocese} onChange={set("diocese")} className={inputClass} /></div>
          <div><label className={labelClass}>Confirming Bishop <span className="text-red-500">*</span></label><input type="text" value={form.confirmingBishop} onChange={set("confirmingBishop")} required className={inputClass} /></div>
          <div><label className={labelClass}>Sponsor <span className="text-red-500">*</span></label><input type="text" value={form.sponsorName} onChange={set("sponsorName")} required className={inputClass} /></div>
          <div><label className={labelClass}>Confirmation Saint Name <span className="text-red-500">*</span></label><input type="text" value={form.confirmationSaintName} onChange={set("confirmationSaintName")} required className={inputClass} placeholder="e.g. Mary, Joseph, Francis" /></div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Baptismal Reference (Canon 895)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Baptismal Parish <span className="text-red-500">*</span></label><input type="text" value={form.baptismalParish} onChange={set("baptismalParish")} required className={inputClass} /></div>
          <div><label className={labelClass}>Baptismal Book Reference</label><input type="text" value={form.baptismalBookRef} onChange={set("baptismalBookRef")} className={inputClass} placeholder="Auto-filled if baptism on record" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.updateBaptismRecord} onChange={(e) => setForm((f) => ({ ...f, updateBaptismRecord: e.target.checked }))} className="rounded" />
          Automatically add marginal note to baptism register
        </label>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Save Confirmation Record"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}

export default function NewConfirmationPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="New Confirmation Record" subtitle="Record a confirmation in the parish register" />
      <div className="p-8">
        <Suspense><NewConfirmationForm /></Suspense>
      </div>
    </div>
  );
}
