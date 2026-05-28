"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function NewClassPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", year: new Date().getFullYear().toString(), sacramentType: "CONFIRMATION", catechist: "", description: "" });
  const [saving, setSaving] = useState(false);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    router.push(`/classes/${data.id}`);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex-1 flex flex-col">
      <Header title="New Class" subtitle="Create a catechism class or cohort" />
      <div className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Class Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={set("name")} required placeholder="e.g. Confirmation 2024" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Year <span className="text-red-500">*</span></label>
                <input type="number" value={form.year} onChange={set("year")} required min={2000} max={2100} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sacrament Type <span className="text-red-500">*</span></label>
                <select value={form.sacramentType} onChange={set("sacramentType")} className={inputClass}>
                  <option value="BAPTISM">Baptism</option>
                  <option value="CONFIRMATION">Confirmation</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Catechist</label>
                <input type="text" value={form.catechist} onChange={set("catechist")} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={set("description")} rows={3} className={inputClass} />
              </div>
            </div>
          </section>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] disabled:opacity-60 transition-colors">
              {saving ? "Creating..." : "Create Class"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
