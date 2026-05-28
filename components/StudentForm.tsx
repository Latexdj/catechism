"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StudentFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  contactNumber: string;
  email: string;
  fatherName: string;
  motherName: string;
  notes: string;
}

interface Props {
  initial?: Partial<StudentFormData>;
  studentId?: string;
  onSuccess?: (id: string) => void;
}

const empty: StudentFormData = {
  firstName: "", lastName: "", middleName: "", dateOfBirth: "",
  placeOfBirth: "", address: "", contactNumber: "", email: "",
  fatherName: "", motherName: "", notes: "",
};

export default function StudentForm({ initial, studentId, onSuccess }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<StudentFormData>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof StudentFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = studentId ? `/api/students/${studentId}` : "/api/students";
    const method = studentId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Failed to save student. Please try again.");
      setSaving(false);
      return;
    }

    const data = await res.json();
    if (onSuccess) onSuccess(data.id);
    else router.push(`/students/${data.id}`);
  }

  const field = (label: string, key: keyof StudentFormData, type = "text", required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {field("First Name", "firstName", "text", true)}
          {field("Middle Name", "middleName")}
          {field("Last Name", "lastName", "text", true)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Date of Birth", "dateOfBirth", "date", true)}
          {field("Place of Birth", "placeOfBirth")}
        </div>
        {field("Address", "address")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Contact Number", "contactNumber", "tel")}
          {field("Email", "email", "email")}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
          Parents / Guardian
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Father's Full Name", "fatherName")}
          {field("Mother's Full Name (incl. maiden name)", "motherName")}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1e3a5f] text-sm uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">
          Notes
        </h2>
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          placeholder="Any additional notes..."
        />
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : studentId ? "Update Student" : "Add Student"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
