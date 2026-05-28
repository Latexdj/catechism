"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { fullName, formatDate, formatRegisterRef } from "@/lib/utils";
import { Edit, Droplets, Flame, BookOpen, Plus, Printer } from "lucide-react";

interface StudentDetail {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  notes?: string;
  baptism: {
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
  } | null;
  confirmation: {
    id: string;
    dateOfConfirmation: string;
    placeOfConfirmation: string;
    confirmingBishop: string;
    sponsorName: string;
    confirmationSaintName: string;
    baptismalParish: string;
    baptismalBookRef?: string;
    notificationStatus: string;
    registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
  } | null;
  classMembers: Array<{ class: { id: string; name: string; year: number; sacramentType: string } }>;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-800">{value || "—"}</dd>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then(setStudent);
  }, [id]);

  if (!student) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={fullName(student)}
        subtitle="Student Record"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/students/${id}/baptismal-card?print=1`}
              className="flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Printer size={15} /> Baptismal Card
            </Link>
            <Link
              href={`/students/${id}/edit`}
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5f8a] transition-colors"
            >
              <Edit size={15} /> Edit
            </Link>
          </div>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
            Personal Information
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoRow label="First Name" value={student.firstName} />
            <InfoRow label="Middle Name" value={student.middleName} />
            <InfoRow label="Last Name" value={student.lastName} />
            <InfoRow label="Date of Birth" value={formatDate(student.dateOfBirth)} />
            <InfoRow label="Place of Birth" value={student.placeOfBirth} />
            <InfoRow label="Address" value={student.address} />
            <InfoRow label="Contact" value={student.contactNumber} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Father's Name" value={student.fatherName} />
            <InfoRow label="Mother's Name" value={student.motherName} />
          </dl>
          {student.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</dt>
              <dd className="mt-1 text-sm text-gray-700">{student.notes}</dd>
            </div>
          )}
        </div>

        {/* Baptism Record */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
              <Droplets size={15} className="text-indigo-600" /> Baptism Record
            </h2>
            {!student.baptism && (
              <Link href={`/baptism/new?studentId=${id}`} className="flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium">
                <Plus size={13} /> Add
              </Link>
            )}
            {student.baptism && (
              <div className="flex gap-3">
                <Link href={`/baptism/${student.baptism.id}`} className="text-xs text-[#1e3a5f] hover:underline font-medium">Edit</Link>
                <Link href={`/certificates?type=baptism&id=${student.baptism.id}`} className="text-xs text-indigo-600 hover:underline font-medium">Print Certificate</Link>
              </div>
            )}
          </div>
          {student.baptism ? (
            <div className="space-y-5">
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoRow label="Date of Baptism" value={formatDate(student.baptism.dateOfBaptism)} />
                <InfoRow label="Place" value={student.baptism.placeOfBaptism} />
                <InfoRow label="Diocese" value={student.baptism.diocese} />
                <InfoRow label="Minister" value={student.baptism.minister} />
                <InfoRow label="Godfather" value={student.baptism.godfatherName} />
                <InfoRow label="Godmother" value={student.baptism.godmotherName} />
                <InfoRow label="Witnesses" value={student.baptism.witnesses} />
                <InfoRow label="Register Ref." value={formatRegisterRef(student.baptism.registerBook.bookNumber, student.baptism.registerBook.pageNumber, student.baptism.registerBook.entryNumber)} />
                <InfoRow label="Marginal Notes" value={student.baptism.marginalNotes} />
              </dl>

              {/* Life events — only shown if at least one has data */}
              {(student.baptism.firstCommunionDate || student.baptism.marriageDate || student.baptism.husbandName || student.baptism.wifeName) && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Subsequent Life Events</p>

                  {(student.baptism.firstCommunionDate || student.baptism.firstCommunionPlace) && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">First Holy Communion</p>
                      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InfoRow label="Date" value={formatDate(student.baptism.firstCommunionDate)} />
                        <InfoRow label="Place" value={student.baptism.firstCommunionPlace} />
                      </dl>
                    </div>
                  )}

                  {(student.baptism.marriageDate || student.baptism.marriagePlace) && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Marriage</p>
                      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InfoRow label="Date" value={formatDate(student.baptism.marriageDate)} />
                        <InfoRow label="Place" value={student.baptism.marriagePlace} />
                        <InfoRow label="Register No." value={student.baptism.marriageNo} />
                      </dl>
                    </div>
                  )}

                  {student.baptism.husbandName && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Husband</p>
                      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InfoRow label="Name" value={student.baptism.husbandName} />
                        <InfoRow label="Date of Baptism" value={formatDate(student.baptism.husbandBaptismDate)} />
                        <InfoRow label="Register No." value={student.baptism.husbandBaptismNo} />
                      </dl>
                    </div>
                  )}

                  {student.baptism.wifeName && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Wife</p>
                      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InfoRow label="Name" value={student.baptism.wifeName} />
                        <InfoRow label="Date of Baptism" value={formatDate(student.baptism.wifeBaptismDate)} />
                        <InfoRow label="Register No." value={student.baptism.wifeBaptismNo} />
                        <InfoRow label="Signed By" value={student.baptism.signedBy} />
                      </dl>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No baptism record on file.</p>
          )}
        </div>

        {/* Confirmation Record */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
              <Flame size={15} className="text-amber-600" /> Confirmation Record
            </h2>
            {!student.confirmation && (
              <Link href={`/confirmation/new?studentId=${id}`} className="flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline font-medium">
                <Plus size={13} /> Add
              </Link>
            )}
            {student.confirmation && (
              <div className="flex gap-3">
                <Link href={`/confirmation/${student.confirmation.id}`} className="text-xs text-[#1e3a5f] hover:underline font-medium">Edit</Link>
                <Link href={`/certificates?type=confirmation&id=${student.confirmation.id}`} className="text-xs text-amber-600 hover:underline font-medium">Print Certificate</Link>
              </div>
            )}
          </div>
          {student.confirmation ? (
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoRow label="Date" value={formatDate(student.confirmation.dateOfConfirmation)} />
              <InfoRow label="Place" value={student.confirmation.placeOfConfirmation} />
              <InfoRow label="Confirming Bishop" value={student.confirmation.confirmingBishop} />
              <InfoRow label="Sponsor" value={student.confirmation.sponsorName} />
              <InfoRow label="Confirmation Name" value={student.confirmation.confirmationSaintName} />
              <InfoRow label="Baptismal Parish" value={student.confirmation.baptismalParish} />
              <InfoRow label="Baptismal Book Ref." value={student.confirmation.baptismalBookRef} />
              <InfoRow label="Register Ref." value={formatRegisterRef(student.confirmation.registerBook.bookNumber, student.confirmation.registerBook.pageNumber, student.confirmation.registerBook.entryNumber)} />
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notification Status</dt>
                <dd className="mt-0.5">
                  <span className={`text-xs px-2 py-1 rounded-full ${student.confirmation.notificationStatus === "SENT" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {student.confirmation.notificationStatus}
                  </span>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-400">No confirmation record on file.</p>
          )}
        </div>

        {/* Classes */}
        {student.classMembers.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <BookOpen size={15} /> Classes Enrolled
            </h2>
            <div className="flex flex-wrap gap-2">
              {student.classMembers.map((cm) => (
                <Link key={cm.class.id} href={`/classes/${cm.class.id}`} className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  {cm.class.name} ({cm.class.year})
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
