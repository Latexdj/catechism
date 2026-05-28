"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { formatDate, fullName, formatRegisterRef } from "@/lib/utils";
import { Printer } from "lucide-react";

interface BaptismCertData {
  id: string;
  dateOfBaptism: string;
  placeOfBaptism: string;
  diocese?: string;
  minister: string;
  godfatherName: string;
  godmotherName: string;
  witnesses?: string;
  marginalNotes?: string;
  student: {
    firstName: string; middleName?: string; lastName: string;
    dateOfBirth: string; placeOfBirth?: string;
    fatherName?: string; motherName?: string;
  };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

interface ConfirmationCertData {
  id: string;
  dateOfConfirmation: string;
  placeOfConfirmation: string;
  diocese?: string;
  confirmingBishop: string;
  sponsorName: string;
  confirmationSaintName: string;
  baptismalParish: string;
  baptismalBookRef?: string;
  student: {
    firstName: string; middleName?: string; lastName: string;
    dateOfBirth: string; placeOfBirth?: string;
    fatherName?: string; motherName?: string;
  };
  registerBook: { bookNumber: number; pageNumber: number; entryNumber: number };
}

function BaptismCertificate({ data }: { data: BaptismCertData }) {
  return (
    <div className="certificate bg-white border-4 border-double border-[#1e3a5f] p-10 max-w-2xl mx-auto shadow-lg">
      <div className="text-center mb-6 border-b-2 border-[#c9a84c] pb-6">
        <div className="text-4xl text-[#c9a84c] mb-2">✝</div>
        <h1 className="text-2xl font-bold text-[#1e3a5f] tracking-wide">CERTIFICATE OF BAPTISM</h1>
        <p className="text-sm text-gray-500 mt-1 italic">Roman Catholic Parish</p>
        <p className="text-sm text-gray-600 mt-0.5">{data.placeOfBaptism}{data.diocese ? `, ${data.diocese}` : ""}</p>
      </div>

      <p className="text-sm text-gray-700 text-center mb-6 leading-relaxed">
        This is to certify that
      </p>

      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-[#1e3a5f] tracking-wide">{fullName(data.student)}</p>
        <p className="text-sm text-gray-500 mt-1">
          born on {formatDate(data.student.dateOfBirth)}
          {data.student.placeOfBirth ? ` in ${data.student.placeOfBirth}` : ""}
        </p>
        {(data.student.fatherName || data.student.motherName) && (
          <p className="text-sm text-gray-500 mt-0.5">
            child of {data.student.fatherName || "—"} and {data.student.motherName || "—"}
          </p>
        )}
      </div>

      <p className="text-sm text-gray-700 text-center mb-6 leading-relaxed">
        was solemnly baptized according to the Rite of the Roman Catholic Church on
      </p>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-[#1e3a5f]">{formatDate(data.dateOfBaptism)}</p>
        <p className="text-sm text-gray-600">at {data.placeOfBaptism}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm mb-6 bg-gray-50 rounded-lg p-4">
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Minister</span>{data.minister}</div>
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Godfather</span>{data.godfatherName}</div>
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Godmother</span>{data.godmotherName}</div>
        {data.witnesses && <div><span className="text-xs font-semibold text-gray-500 uppercase block">Witnesses</span>{data.witnesses}</div>}
        <div className="col-span-2"><span className="text-xs font-semibold text-gray-500 uppercase block">Register Reference</span>
          {formatRegisterRef(data.registerBook.bookNumber, data.registerBook.pageNumber, data.registerBook.entryNumber)}
        </div>
        {data.marginalNotes && <div className="col-span-2"><span className="text-xs font-semibold text-gray-500 uppercase block">Annotations</span>{data.marginalNotes}</div>}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-1 pb-6"></div>
          <p className="text-xs text-gray-500">Parish Priest / Pastor</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-1 pb-6"></div>
          <p className="text-xs text-gray-500">Date Issued</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 italic">
        Issued on {formatDate(new Date().toISOString())}
      </p>
    </div>
  );
}

function ConfirmationCertificate({ data }: { data: ConfirmationCertData }) {
  return (
    <div className="certificate bg-white border-4 border-double border-[#c9a84c] p-10 max-w-2xl mx-auto shadow-lg">
      <div className="text-center mb-6 border-b-2 border-[#1e3a5f] pb-6">
        <div className="text-4xl text-[#c9a84c] mb-2">🕊</div>
        <h1 className="text-2xl font-bold text-[#1e3a5f] tracking-wide">CERTIFICATE OF CONFIRMATION</h1>
        <p className="text-sm text-gray-500 mt-1 italic">Roman Catholic Parish</p>
        <p className="text-sm text-gray-600 mt-0.5">{data.placeOfConfirmation}{data.diocese ? `, ${data.diocese}` : ""}</p>
      </div>

      <p className="text-sm text-gray-700 text-center mb-6 leading-relaxed">
        This is to certify that
      </p>

      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-[#1e3a5f] tracking-wide">{fullName(data.student)}</p>
        <p className="text-sm text-gray-500 mt-1">
          born on {formatDate(data.student.dateOfBirth)}
          {data.student.placeOfBirth ? ` in ${data.student.placeOfBirth}` : ""}
        </p>
        {(data.student.fatherName || data.student.motherName) && (
          <p className="text-sm text-gray-500 mt-0.5">
            child of {data.student.fatherName || "—"} and {data.student.motherName || "—"}
          </p>
        )}
      </div>

      <p className="text-sm text-gray-700 text-center mb-6 leading-relaxed">
        received the Sacrament of Confirmation, taking the name
      </p>

      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-[#c9a84c] italic">{data.confirmationSaintName}</p>
        <p className="text-base font-semibold text-[#1e3a5f] mt-2">{formatDate(data.dateOfConfirmation)}</p>
        <p className="text-sm text-gray-600">at {data.placeOfConfirmation}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm mb-6 bg-gray-50 rounded-lg p-4">
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Confirming Bishop</span>{data.confirmingBishop}</div>
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Sponsor</span>{data.sponsorName}</div>
        <div><span className="text-xs font-semibold text-gray-500 uppercase block">Baptismal Parish</span>{data.baptismalParish}</div>
        {data.baptismalBookRef && <div><span className="text-xs font-semibold text-gray-500 uppercase block">Baptismal Record</span>{data.baptismalBookRef}</div>}
        <div className="col-span-2"><span className="text-xs font-semibold text-gray-500 uppercase block">Register Reference</span>
          {formatRegisterRef(data.registerBook.bookNumber, data.registerBook.pageNumber, data.registerBook.entryNumber)}
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-1 pb-6"></div>
          <p className="text-xs text-gray-500">Parish Priest / Pastor</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-1 pb-6"></div>
          <p className="text-xs text-gray-500">Date Issued</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 italic">
        Issued on {formatDate(new Date().toISOString())}
      </p>
    </div>
  );
}

function CertificateContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const printRef = useRef<HTMLDivElement>(null);

  const [baptismData, setBaptismData] = useState<BaptismCertData | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationCertData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    const url = type === "baptism" ? `/api/baptism/${id}` : `/api/confirmation/${id}`;
    fetch(url).then((r) => r.json()).then((data) => {
      if (type === "baptism") setBaptismData(data);
      else setConfirmationData(data);
      setLoading(false);
    });
  }, [id, type]);

  function handlePrint() {
    window.print();
  }

  if (!type || !id) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Select a record from the Students, Baptism, or Confirmation pages to print a certificate.</p>
      </div>
    );
  }

  if (loading) return <p className="text-center text-gray-400 py-8">Loading certificate...</p>;

  return (
    <div>
      <div className="flex justify-center mb-8 no-print">
        <button onClick={handlePrint} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d5f8a] transition-colors">
          <Printer size={18} /> Print Certificate
        </button>
      </div>
      <div ref={printRef}>
        {type === "baptism" && baptismData && <BaptismCertificate data={baptismData} />}
        {type === "confirmation" && confirmationData && <ConfirmationCertificate data={confirmationData} />}
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Certificates" subtitle="Print baptismal and confirmation certificates" />
      <div className="p-8">
        <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
          <CertificateContent />
        </Suspense>
      </div>
    </div>
  );
}
