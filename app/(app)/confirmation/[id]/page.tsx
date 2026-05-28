"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { ScrollText, Send } from "lucide-react";

interface ConfirmationRecord {
  id: string;
  dateOfConfirmation: string;
  placeOfConfirmation: string;
  diocese?: string;
  confirmingBishop: string;
  sponsorName: string;
  confirmationSaintName: string;
  baptismalParish: string;
  baptismalBookRef?: string;
  notificationStatus: string;
  notificationSentAt?: string;
  student: { id: string; firstName: string; middleName?: string; lastName: string };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

export default function ConfirmationEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<ConfirmationRecord | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [markingSent, setMarkingSent] = useState(false);

  useEffect(() => {
    fetch(`/api/confirmation/${id}`).then((r) => r.json()).then((data) => {
      setRecord(data);
      setForm({
        dateOfConfirmation: data.dateOfConfirmation?.split("T")[0] || "",
        placeOfConfirmation: data.placeOfConfirmation || "",
        diocese: data.diocese || "",
        confirmingBishop: data.confirmingBishop || "",
        sponsorName: data.sponsorName || "",
        confirmationSaintName: data.confirmationSaintName || "",
        baptismalParish: data.baptismalParish || "",
        baptismalBookRef: data.baptismalBookRef || "",
        notificationStatus: data.notificationStatus || "PENDING",
        notificationSentAt: data.notificationSentAt?.split("T")[0] || "",
      });
    });
  }, [id]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/confirmation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push(`/students/${record?.student.id}`);
  }

  async function markNotificationSent() {
    setMarkingSent(true);
    await fetch(`/api/confirmation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, notificationStatus: "SENT", notificationSentAt: new Date().toISOString().split("T")[0] }),
    });
    const updated = await fetch(`/api/confirmation/${id}`).then((r) => r.json());
    setRecord(updated);
    setForm((f) => ({ ...f, notificationStatus: "SENT", notificationSentAt: new Date().toISOString().split("T")[0] }));
    setMarkingSent(false);
  }

  if (!record) return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`Confirmation: ${fullName(record.student)}`}
        subtitle={formatRegisterRef(record.registerBook.bookNumber, record.registerBook.pageNumber, record.registerBook.entryNumber)}
        actions={
          <Link href={`/certificates?type=confirmation&id=${id}`} className="flex items-center gap-2 border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50">
            <ScrollText size={15} /> Print Certificate
          </Link>
        }
      />
      <div className="p-8">
        {/* Notification Banner */}
        {form.notificationStatus === "PENDING" && (
          <div className="max-w-3xl mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-yellow-800">Notification Required (Canon 895)</p>
              <p className="text-xs text-yellow-600 mt-1">
                This confirmation must be reported to the baptismal parish: <strong>{record.baptismalParish}</strong>
              </p>
            </div>
            <button onClick={markNotificationSent} disabled={markingSent} className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-60 whitespace-nowrap">
              <Send size={14} /> {markingSent ? "Saving..." : "Mark as Sent"}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Confirmation Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Date of Confirmation</label><input type="date" value={form.dateOfConfirmation} onChange={set("dateOfConfirmation")} className={inputClass} /></div>
              <div><label className={labelClass}>Place</label><input type="text" value={form.placeOfConfirmation} onChange={set("placeOfConfirmation")} className={inputClass} /></div>
              <div><label className={labelClass}>Diocese</label><input type="text" value={form.diocese} onChange={set("diocese")} className={inputClass} /></div>
              <div><label className={labelClass}>Confirming Bishop</label><input type="text" value={form.confirmingBishop} onChange={set("confirmingBishop")} className={inputClass} /></div>
              <div><label className={labelClass}>Sponsor</label><input type="text" value={form.sponsorName} onChange={set("sponsorName")} className={inputClass} /></div>
              <div><label className={labelClass}>Confirmation Saint Name</label><input type="text" value={form.confirmationSaintName} onChange={set("confirmationSaintName")} className={inputClass} /></div>
              <div><label className={labelClass}>Baptismal Parish</label><input type="text" value={form.baptismalParish} onChange={set("baptismalParish")} className={inputClass} /></div>
              <div><label className={labelClass}>Baptismal Book Ref.</label><input type="text" value={form.baptismalBookRef} onChange={set("baptismalBookRef")} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Notification Status</label>
                <select value={form.notificationStatus} onChange={set("notificationStatus")} className={inputClass}>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="NOT_REQUIRED">Not Required</option>
                </select>
              </div>
              <div><label className={labelClass}>Notification Sent Date</label><input type="date" value={form.notificationSentAt} onChange={set("notificationSentAt")} className={inputClass} /></div>
            </div>
          </section>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] disabled:opacity-60 transition-colors">
              {saving ? "Saving..." : "Update Record"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
