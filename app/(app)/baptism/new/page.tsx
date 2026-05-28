"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Student { id: string; firstName: string; middleName?: string; lastName: string }

function NewBaptismForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId") || "";

  const [students, setStudents] = useState<Student[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: preselectedStudentId,
    dateOfBaptism: "",
    placeOfBaptism: "",
    diocese: "",
    minister: "",
    godfatherName: "",
    godmotherName: "",
    witnesses: "",
    marginalNotes: "",
  });

  useEffect(() => {
    fetch("/api/students").then((r) => r.json()).then(setStudents);
  }, []);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/baptism", {
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
              <option key={s.id} value={s.id}>
                {s.lastName}, {s.firstName}{s.middleName ? ` ${s.middleName}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Baptism Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date of Baptism <span className="text-red-500">*</span></label>
            <input type="date" value={form.dateOfBaptism} onChange={set("dateOfBaptism")} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Place of Baptism (Church) <span className="text-red-500">*</span></label>
            <input type="text" value={form.placeOfBaptism} onChange={set("placeOfBaptism")} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Diocese</label>
            <input type="text" value={form.diocese} onChange={set("diocese")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Minister (Priest/Deacon) <span className="text-red-500">*</span></label>
            <input type="text" value={form.minister} onChange={set("minister")} required className={inputClass} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Godparents & Witnesses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Godfather (Padrino) <span className="text-red-500">*</span></label>
            <input type="text" value={form.godfatherName} onChange={set("godfatherName")} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Godmother (Madrina) <span className="text-red-500">*</span></label>
            <input type="text" value={form.godmotherName} onChange={set("godmotherName")} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Witnesses</label>
            <input type="text" value={form.witnesses} onChange={set("witnesses")} className={inputClass} placeholder="Separate multiple witnesses with commas" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">Marginal Notes</h2>
        <textarea value={form.marginalNotes} onChange={set("marginalNotes")} rows={2} className={inputClass} placeholder="Notes to be added to the register margin (e.g. marriage annotations)" />
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Save Baptism Record"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}

export default function NewBaptismPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="New Baptism Record" subtitle="Record a baptism in the parish register" />
      <div className="p-8">
        <Suspense><NewBaptismForm /></Suspense>
      </div>
    </div>
  );
}
