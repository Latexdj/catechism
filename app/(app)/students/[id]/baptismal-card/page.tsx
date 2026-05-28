"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fullName, formatDate } from "@/lib/utils";
import { Printer, ArrowLeft } from "lucide-react";

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
  firstCommunionDate?: string;
  firstCommunionPlace?: string;
  marriageDate?: string;
  marriagePlace?: string;
  marriageNo?: string;
  husbandName?: string;
  husbandBaptismDate?: string;
  husbandBaptismNo?: string;
  wifeName?: string;
  wifeBaptismDate?: string;
  wifeBaptismNo?: string;
  signedBy?: string;
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

interface StudentDetail {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  fatherName?: string;
  motherName?: string;
  baptism: BaptismRecord | null;
  confirmation: {
    dateOfConfirmation: string;
    placeOfConfirmation: string;
    confirmingBishop: string;
    sponsorName: string;
    confirmationSaintName: string;
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  } | null;
}

// ─── Field row with dotted underline ─────────────────────────────────────────

function Field({
  label,
  value,
  noteLabel,
  note,
}: {
  label: string;
  value?: string | null;
  noteLabel?: string;
  note?: string | null;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "3px", padding: "2.5px 0" }}>
      <span style={{ fontSize: "10.5pt", fontFamily: "Georgia, serif", whiteSpace: "nowrap", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{
        flex: 1, borderBottom: "1px dotted #555",
        minWidth: 0, padding: "0 4px", fontSize: "9.5pt",
        fontFamily: "Georgia, serif", color: "#222", lineHeight: 1.3,
      }}>
        {value || ""}
      </span>
      {noteLabel && (
        <>
          <span style={{ fontSize: "10.5pt", fontFamily: "Georgia, serif", whiteSpace: "nowrap", flexShrink: 0, marginLeft: "4px" }}>
            {noteLabel}
          </span>
          <span style={{
            width: "60px", borderBottom: "1px dotted #555",
            padding: "0 4px", fontSize: "9.5pt", fontFamily: "Georgia, serif",
            color: "#222", flexShrink: 0,
          }}>
            {note || ""}
          </span>
        </>
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ borderBottom: "0.5px solid #ddd", margin: "3px 0" }} />;
}

// ─── Card content ─────────────────────────────────────────────────────────────

function CardContent({ student }: { student: StudentDetail }) {
  const bap  = student.baptism;
  const conf = student.confirmation;

  const birthLine = [
    student.dateOfBirth ? formatDate(student.dateOfBirth) : "",
    student.placeOfBirth ?? "",
  ].filter(Boolean).join("  —  ");

  const baptismNo = bap  ? String(bap.registerBook.entryNumber)  : "";
  const confirmNo = conf ? String(conf.registerBook.entryNumber) : "";

  return (
    <div style={{
      width: "148mm", minHeight: "210mm", padding: "12mm 14mm",
      background: "white", boxSizing: "border-box",
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "5mm" }}>
        <div style={{ fontSize: "7.5pt", letterSpacing: "0.15em", color: "#666", marginBottom: "1mm" }}>
          ROMAN CATHOLIC
        </div>
        <div style={{ fontSize: "14pt", fontWeight: "bold", letterSpacing: "0.04em" }}>
          DIOCESE OF WA
        </div>
        <div style={{ fontSize: "8.5pt", color: "#777", marginTop: "0.5mm" }}>
          Baptismal Record Card
        </div>
        <div style={{ borderBottom: "1.5px solid #000", marginTop: "3.5mm" }} />
      </div>

      {/* Personal */}
      <Field label="Name:" value={fullName(student)} />
      <Field label="Residence:" value={student.address} />
      <Field label="Birth:" value={birthLine} />
      <Field label="Father:" value={student.fatherName} />
      <Field label="Mother:" value={student.motherName} />

      <Divider />

      {/* Baptism */}
      <Field label="Place of Baptism:" value={bap?.placeOfBaptism} noteLabel="No." note={baptismNo} />
      <Field label="Date of Baptism:" value={bap ? formatDate(bap.dateOfBaptism) : ""} />
      <Field label="Minister:" value={bap?.minister} />
      <Field label="Godfather:" value={bap?.godfatherName} />
      <Field label="Godmother:" value={bap?.godmotherName} />

      <Divider />

      {/* 1st Communion */}
      <Field
        label="1st Comm. The"
        value={bap?.firstCommunionDate ? formatDate(bap.firstCommunionDate) : ""}
        noteLabel="Place"
        note={bap?.firstCommunionPlace || ""}
      />

      <Divider />

      {/* Confirmation */}
      <Field label="Place of Confirmation:" value={conf?.placeOfConfirmation} />
      <Field label="Date of Confirmation:" value={conf ? formatDate(conf.dateOfConfirmation) : ""} noteLabel="No." note={confirmNo} />
      {conf && (
        <>
          <Field label="Confirming Bishop:" value={conf.confirmingBishop} />
          <Field label="Sponsor:" value={conf.sponsorName} />
          <Field label="Confirmation Name:" value={conf.confirmationSaintName} />
        </>
      )}

      <Divider />

      {/* Marriage */}
      <Field label="Where Married:" value={bap?.marriagePlace} />
      <Field label="Date of Married:" value={bap?.marriageDate ? formatDate(bap.marriageDate) : ""} noteLabel="No." note={bap?.marriageNo || ""} />

      {/* Husband bracket */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "3px", margin: "3mm 0 1mm" }}>
        <span style={{ fontSize: "10.5pt", minWidth: "50px", lineHeight: 1.6 }}>Husband</span>
        <span style={{ fontSize: "24pt", lineHeight: 1, marginTop: "-5px", color: "#444", marginRight: "3px" }}>{"{"}</span>
        <div style={{ flex: 1 }}>
          <Field label="Name:" value={bap?.husbandName} />
          <Field label="Date of Bapt.:" value={bap?.husbandBaptismDate ? formatDate(bap.husbandBaptismDate) : ""} noteLabel="No." note={bap?.husbandBaptismNo || ""} />
        </div>
      </div>

      {/* Wife bracket */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "3px", margin: "2mm 0 1mm" }}>
        <span style={{ fontSize: "10.5pt", minWidth: "50px", lineHeight: 1.6 }}>Wife</span>
        <span style={{ fontSize: "24pt", lineHeight: 1, marginTop: "-5px", color: "#444", marginRight: "3px" }}>{"{"}</span>
        <div style={{ flex: 1 }}>
          <Field label="Name:" value={bap?.wifeName} />
          <Field label="Date of Bapt.:" value={bap?.wifeBaptismDate ? formatDate(bap.wifeBaptismDate) : ""} noteLabel="No." note={bap?.wifeBaptismNo || ""} />
          <Field label="Signed:" value={bap?.signedBy} />
        </div>
      </div>

      {/* Marginal notes */}
      {bap?.marginalNotes && (
        <>
          <Divider />
          <Field label="Notes:" value={bap.marginalNotes} />
        </>
      )}

      {/* Footer */}
      <div style={{ borderTop: "0.5px solid #ccc", marginTop: "5mm", paddingTop: "2mm", fontSize: "6.5pt", color: "#aaa", textAlign: "center" }}>
        Parish Records System · Printed {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BaptismalCardPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  useEffect(() => {
    // Check if opened with ?print=1 (from the Print Card shortcut)
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "1") setAutoPrint(true);
  }, []);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then((data) => {
      setStudent(data);
      // Auto-trigger print once data is loaded
      if (autoPrint) {
        setTimeout(() => window.print(), 300);
      }
    });
  }, [id, autoPrint]);

  if (!student) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="no-print flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <Link href={`/students/${id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f]">
          <ArrowLeft size={16} /> Back to Student
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors"
        >
          <Printer size={16} /> Print Card
        </button>
      </div>

      {/* Preview */}
      <div className="no-print flex justify-center py-10 px-4">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden" style={{ width: "148mm" }}>
          <CardContent student={student} />
        </div>
      </div>

      {/* Print output */}
      <div className="print-only">
        <CardContent student={student} />
      </div>
    </div>
  );
}
