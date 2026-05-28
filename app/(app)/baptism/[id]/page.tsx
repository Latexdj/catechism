"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { ScrollText } from "lucide-react";

interface BaptismRecord {
  id: string;
  dateOfBaptism: string;
  placeOfBaptism: string;
  diocese?: string;
  minister: string;
  godfatherName: string;
  godmotherName: string;
  witnesses?: string;
  marginalNotes?: string;
  student: { id: string; firstName: string; middleName?: string; lastName: string };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

export default function BaptismEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<BaptismRecord | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/baptism/${id}`).then((r) => r.json()).then((data) => {
      setRecord(data);
      setForm({
        dateOfBaptism: data.dateOfBaptism?.split("T")[0] || "",
        placeOfBaptism: data.placeOfBaptism || "",
        diocese: data.diocese || "",
        minister: data.minister || "",
        godfatherName: data.godfatherName || "",
        godmotherName: data.godmotherName || "",
        witnesses: data.witnesses || "",
        marginalNotes: data.marginalNotes || "",
      });
    });
  }, [id]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/baptism/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push(`/students/${record?.student.id}`);
  }

  if (!record) return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`Baptism: ${fullName(record.student)}`}
        subtitle={formatRegisterRef(record.registerBook.bookNumber, record.registerBook.pageNumber, record.registerBook.entryNumber)}
        actions={
          <Link href={`/certificates?type=baptism&id=${id}`} className="flex items-center gap-2 border border-indigo-300 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50">
            <ScrollText size={15} /> Print Certificate
          </Link>
        }
      />
      <div className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Baptism Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Date of Baptism</label><input type="date" value={form.dateOfBaptism} onChange={set("dateOfBaptism")} className={inputClass} /></div>
              <div><label className={labelClass}>Place of Baptism</label><input type="text" value={form.placeOfBaptism} onChange={set("placeOfBaptism")} className={inputClass} /></div>
              <div><label className={labelClass}>Diocese</label><input type="text" value={form.diocese} onChange={set("diocese")} className={inputClass} /></div>
              <div><label className={labelClass}>Minister</label><input type="text" value={form.minister} onChange={set("minister")} className={inputClass} /></div>
              <div><label className={labelClass}>Godfather</label><input type="text" value={form.godfatherName} onChange={set("godfatherName")} className={inputClass} /></div>
              <div><label className={labelClass}>Godmother</label><input type="text" value={form.godmotherName} onChange={set("godmotherName")} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Witnesses</label><input type="text" value={form.witnesses} onChange={set("witnesses")} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Marginal Notes</label><textarea value={form.marginalNotes} onChange={set("marginalNotes")} rows={2} className={inputClass} /></div>
            </div>
          </section>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Update Record"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
