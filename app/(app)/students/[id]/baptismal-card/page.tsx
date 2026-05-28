"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { Printer, ArrowLeft } from "lucide-react";

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
  baptism: {
    dateOfBaptism: string;
    placeOfBaptism: string;
    diocese?: string;
    minister: string;
    godfatherName: string;
    godmotherName: string;
    marginalNotes?: string;
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  } | null;
  confirmation: {
    dateOfConfirmation: string;
    placeOfConfirmation: string;
    confirmingBishop: string;
    sponsorName: string;
    confirmationSaintName: string;
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  } | null;
}

// Dotted line field — renders a label and a dotted fill line with an optional right-side note
function Field({
  label,
  value,
  note,
  noteLabel,
  className = "",
}: {
  label: string;
  value?: string | null;
  note?: string | null;
  noteLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline gap-1 py-[3px] ${className}`}>
      <span className="text-[11pt] font-serif whitespace-nowrap flex-shrink-0">{label}</span>
      <span className="flex-1 border-b border-dotted border-gray-500 min-w-0 px-1 text-[10pt] font-serif text-gray-800 leading-tight">
        {value || ""}
      </span>
      {noteLabel && (
        <>
          <span className="text-[11pt] font-serif whitespace-nowrap flex-shrink-0 ml-1">{noteLabel}</span>
          <span className="w-20 border-b border-dotted border-gray-500 px-1 text-[10pt] font-serif text-gray-800 leading-tight flex-shrink-0">
            {note || ""}
          </span>
        </>
      )}
    </div>
  );
}

export default function BaptismalCardPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then(setStudent);
  }, [id]);

  if (!student) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const bap = student.baptism;
  const conf = student.confirmation;

  const baptismNo    = bap  ? String(bap.registerBook.entryNumber)  : "";
  const confirmNo    = conf ? String(conf.registerBook.entryNumber) : "";

  const birthLine = [
    student.dateOfBirth ? formatDate(student.dateOfBirth) : "",
    student.placeOfBirth ?? "",
  ].filter(Boolean).join("  —  ");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Toolbar — hidden on print */}
      <div className="no-print flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <Link
          href={`/students/${id}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f]"
        >
          <ArrowLeft size={16} /> Back to Student
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5f8a] transition-colors"
        >
          <Printer size={16} /> Print Card
        </button>
      </div>

      {/* Card preview area */}
      <div className="no-print flex items-start justify-center py-10 px-4">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden" style={{ width: "148mm" }}>
          <CardContent student={student} bap={bap} conf={conf} birthLine={birthLine} baptismNo={baptismNo} confirmNo={confirmNo} />
        </div>
      </div>

      {/* Print-only output — fills the page */}
      <div className="print-only">
        <CardContent student={student} bap={bap} conf={conf} birthLine={birthLine} baptismNo={baptismNo} confirmNo={confirmNo} />
      </div>
    </div>
  );
}

function CardContent({
  student, bap, conf, birthLine, baptismNo, confirmNo,
}: {
  student: StudentDetail;
  bap: StudentDetail["baptism"];
  conf: StudentDetail["confirmation"];
  birthLine: string;
  baptismNo: string;
  confirmNo: string;
}) {
  return (
    <div
      className="bg-white font-serif"
      style={{
        width: "148mm",
        minHeight: "210mm",
        padding: "12mm 14mm",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Diocese header */}
      <div style={{ textAlign: "center", marginBottom: "6mm" }}>
        <div style={{ fontSize: "8pt", letterSpacing: "0.12em", color: "#555", marginBottom: "1mm" }}>
          ROMAN CATHOLIC
        </div>
        <div style={{ fontSize: "15pt", fontWeight: "bold", letterSpacing: "0.04em" }}>
          DIOCESE OF WA
        </div>
        <div style={{ fontSize: "9pt", color: "#666", marginTop: "1mm" }}>
          Baptismal Record Card
        </div>
        <div style={{ borderBottom: "1.5px solid #000", marginTop: "4mm" }} />
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>

        <Field label="Name:" value={fullName(student)} />
        <Field label="Residence:" value={student.address} />
        <Field label="Birth:" value={birthLine} />
        <Field label="Father:" value={student.fatherName} />
        <Field label="Mother:" value={student.motherName} />

        <div style={{ borderBottom: "0.5px solid #ddd", margin: "2mm 0" }} />

        <Field
          label="Place of Baptism:"
          value={bap?.placeOfBaptism}
          noteLabel="No."
          note={baptismNo}
        />
        <Field label="Date of Baptism:" value={bap ? formatDate(bap.dateOfBaptism) : ""} />
        <Field label="Minister:" value={bap?.minister} />
        <Field label="Godfather:" value={bap?.godfatherName} />
        <Field label="Godmother:" value={bap?.godmotherName} />

        <div style={{ borderBottom: "0.5px solid #ddd", margin: "2mm 0" }} />

        {/* 1st Communion — blank, filled manually */}
        <Field label="1st Comm. The" value="" noteLabel="Place" note="" />

        <div style={{ borderBottom: "0.5px solid #ddd", margin: "2mm 0" }} />

        <Field
          label="Place of Confirmation:"
          value={conf?.placeOfConfirmation}
        />
        <Field
          label="Date of Confirmation:"
          value={conf ? formatDate(conf.dateOfConfirmation) : ""}
          noteLabel="No."
          note={confirmNo}
        />
        {conf && (
          <>
            <Field label="Confirming Bishop:" value={conf.confirmingBishop} />
            <Field label="Sponsor:" value={conf.sponsorName} />
            <Field label="Confirmation Name:" value={conf.confirmationSaintName} />
          </>
        )}

        <div style={{ borderBottom: "0.5px solid #ddd", margin: "2mm 0" }} />

        {/* Marriage — blank, filled manually */}
        <Field label="Where Married:" value="" />
        <Field label="Date of Married:" value="" noteLabel="No." note="" />

        <div style={{ margin: "3mm 0" }}>
          {/* Husband bracket */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "1mm" }}>
            <span style={{ fontSize: "11pt", minWidth: "52px" }}>Husband</span>
            <span style={{ fontSize: "22pt", lineHeight: "1", marginTop: "-4px", marginRight: "2px", color: "#333" }}>{"{"}</span>
            <div style={{ flex: 1 }}>
              <Field label="Name:" value="" />
              <Field label="Date of Bapt.:" value="" noteLabel="No." note="" />
            </div>
          </div>
        </div>

        <div style={{ margin: "3mm 0" }}>
          {/* Wife bracket */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
            <span style={{ fontSize: "11pt", minWidth: "52px" }}>Wife</span>
            <span style={{ fontSize: "22pt", lineHeight: "1", marginTop: "-4px", marginRight: "2px", color: "#333" }}>{"{"}</span>
            <div style={{ flex: 1 }}>
              <Field label="Name:" value="" />
              <Field label="Date of Bapt.:" value="" noteLabel="No." note="" />
              <Field label="Signed:" value="" />
            </div>
          </div>
        </div>

        {/* Marginal notes if any */}
        {bap?.marginalNotes && (
          <>
            <div style={{ borderBottom: "0.5px solid #ddd", margin: "2mm 0" }} />
            <Field label="Notes:" value={bap.marginalNotes} />
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "0.5px solid #ccc", marginTop: "6mm", paddingTop: "3mm", fontSize: "7pt", color: "#999", textAlign: "center" }}>
        Parish Records System · Printed {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}
