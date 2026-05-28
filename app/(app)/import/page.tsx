"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import Header from "@/components/Header";
import {
  downloadTemplate,
  STUDENT_COLUMNS,
  BAPTISM_COLUMNS,
  CONFIRMATION_COLUMNS,
  type TemplateType,
  type ColumnDef,
} from "@/lib/importTemplates";
import {
  Download,
  Upload,
  Users,
  Droplets,
  Flame,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "select" | "upload" | "preview" | "result";

interface ImportResult {
  created: number;
  skipped: number;
  errors: string[];
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { type: TemplateType; label: string; icon: React.ReactNode; color: string; columns: ColumnDef[]; apiPath: string; description: string }[] = [
  {
    type: "students",
    label: "Students",
    icon: <Users size={20} />,
    color: "blue",
    columns: STUDENT_COLUMNS,
    apiPath: "/api/import/students",
    description: "Import student personal information and parent details.",
  },
  {
    type: "baptism",
    label: "Baptism Records",
    icon: <Droplets size={20} />,
    color: "indigo",
    columns: BAPTISM_COLUMNS,
    apiPath: "/api/import/baptism",
    description: "Import baptism records. Students will be created automatically if not found.",
  },
  {
    type: "confirmation",
    label: "Confirmation Records",
    icon: <Flame size={20} />,
    color: "amber",
    columns: CONFIRMATION_COLUMNS,
    apiPath: "/api/import/confirmation",
    description: "Import confirmation records. Students will be created automatically if not found.",
  },
];

const colorMap: Record<string, string> = {
  blue:   "bg-blue-50 border-blue-200 text-blue-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  amber:  "bg-amber-50 border-amber-200 text-amber-700",
};

const activeTabMap: Record<string, string> = {
  blue:   "border-blue-600 text-blue-700",
  indigo: "border-indigo-600 text-indigo-700",
  amber:  "border-amber-600 text-amber-700",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState<Step>("select");
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const tab = TABS[activeTab];

  function reset() {
    setStep("select");
    setParsedRows([]);
    setFileName("");
    setResult(null);
    setParseError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function switchTab(i: number) {
    setActiveTab(i);
    reset();
  }

  // Map parsed CSV header → column key using label matching
  function mapRow(raw: Record<string, string>): Record<string, string> {
    const mapped: Record<string, string> = {};
    for (const col of tab.columns) {
      // Try exact match, then without asterisk, then key directly
      mapped[col.key] =
        raw[`${col.label} *`]?.trim() ||
        raw[col.label]?.trim() ||
        raw[col.key]?.trim() ||
        "";
    }
    return mapped;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data.length) {
          setParseError("The file is empty or has no data rows.");
          return;
        }
        const rows = (res.data as Record<string, string>[]).map(mapRow);
        setParsedRows(rows);
        setStep("preview");
      },
      error: (err) => setParseError(err.message),
    });
  }

  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch(tab.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows }),
      });
      const data: ImportResult = await res.json();
      setResult(data);
      setStep("result");
    } catch {
      setResult({ created: 0, skipped: 0, errors: ["Network error. Please try again."] });
      setStep("result");
    }
    setImporting(false);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Import Records"
        subtitle="Bulk import data from CSV spreadsheets"
      />

      <div className="p-4 sm:p-8 space-y-6">

        {/* ── Tab switcher ── */}
        <div className="flex border-b border-gray-200 gap-0">
          {TABS.map((t, i) => (
            <button
              key={t.type}
              onClick={() => switchTab(i)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                i === activeTab
                  ? `${activeTabMap[t.color]} bg-white`
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 no-print">
          {(["select", "upload", "preview", "result"] as Step[]).map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`font-semibold uppercase ${step === s ? "text-[#1e3a5f]" : ""}`}>
                {s === "select" ? "1. Template" : s === "upload" ? "2. Upload" : s === "preview" ? "3. Preview" : "4. Result"}
              </span>
              {i < arr.length - 1 && <ArrowRight size={12} className="text-gray-300" />}
            </span>
          ))}
        </div>

        {/* ════════════ STEP 1 — Template ════════════ */}
        {step === "select" && (
          <div className="space-y-6">
            {/* Description */}
            <div className={`border rounded-xl p-5 ${colorMap[tab.color]}`}>
              <p className="text-sm font-medium">{tab.description}</p>
            </div>

            {/* Download template card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="font-semibold text-[#1e3a5f] flex items-center gap-2">
                  <FileText size={18} /> Step 1 — Download the Template
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Download this CSV file, fill it in with your data, then upload it below.
                  Columns marked with <span className="text-red-500 font-bold">*</span> are required.
                </p>
              </div>

              <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{tab.label} Template</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tab.columns.length} columns · 3 sample rows included</p>
                </div>
                <button
                  onClick={() => downloadTemplate(tab.type)}
                  className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d5f8a] transition-colors"
                >
                  <Download size={16} /> Download Template
                </button>
              </div>
            </div>

            {/* Column reference */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-[#1e3a5f] text-sm">Column Reference</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {tab.columns.map((col) => (
                  <div key={col.key} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-gray-700">
                      {col.label}
                      {col.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.required ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"}`}>
                      {col.required ? "Required" : "Optional"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceed to upload */}
            <button
              onClick={() => setStep("upload")}
              className="flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] font-bold px-6 py-3 rounded-xl hover:bg-[#b8973b] transition-colors"
            >
              I have my file ready — Upload Now <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ════════════ STEP 2 — Upload ════════════ */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-[#1e3a5f] transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <Upload size={32} className="text-[#1e3a5f]" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Upload your filled CSV file</h3>
              <p className="text-sm text-gray-400 mb-6">
                Only .csv files are accepted. Make sure you used the template provided.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-[#2d5f8a] transition-colors"
              >
                <Upload size={16} /> Choose CSV File
              </label>
              {fileName && (
                <p className="mt-4 text-sm text-gray-600 font-medium">
                  Selected: <span className="text-[#1e3a5f]">{fileName}</span>
                </p>
              )}
              {parseError && (
                <p className="mt-4 text-sm text-red-600 font-medium flex items-center justify-center gap-2">
                  <XCircle size={16} /> {parseError}
                </p>
              )}
            </div>
            <button onClick={() => setStep("select")} className="text-sm text-gray-500 hover:underline">
              ← Back to template
            </button>
          </div>
        )}

        {/* ════════════ STEP 3 — Preview ════════════ */}
        {step === "preview" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <FileText size={22} className="text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{parsedRows.length}</p>
                  <p className="text-sm text-gray-500">Records found in file</p>
                </div>
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-xl">
                  <CheckCircle size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">File</p>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{fileName}</p>
                </div>
              </div>
            </div>

            {/* Preview table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-[#1e3a5f]">Preview (first 5 rows)</h2>
                <span className="text-xs text-gray-400">{parsedRows.length} total rows</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">#</th>
                      {tab.columns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left text-gray-500 font-semibold whitespace-nowrap">
                          {col.label}{col.required && <span className="text-red-400 ml-0.5">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {parsedRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        {tab.columns.map((col) => (
                          <td key={col.key} className={`px-4 py-3 whitespace-nowrap ${col.required && !row[col.key] ? "text-red-500 font-medium" : "text-gray-700"}`}>
                            {row[col.key] || (col.required ? "⚠ Missing" : "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                  + {parsedRows.length - 5} more rows not shown
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2d5f8a] disabled:opacity-60 transition-colors"
              >
                {importing ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Importing...</>
                ) : (
                  <><Upload size={16} /> Import {parsedRows.length} Records</>
                )}
              </button>
              <button onClick={() => setStep("upload")} className="px-5 py-3 rounded-xl border border-gray-300 text-sm hover:bg-gray-50">
                ← Upload different file
              </button>
            </div>
          </div>
        )}

        {/* ════════════ STEP 4 — Result ════════════ */}
        {step === "result" && result && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-3xl font-bold text-green-700">{result.created}</p>
                  <p className="text-sm text-green-600 font-medium">Records Created</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4">
                <AlertCircle size={28} className="text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-3xl font-bold text-yellow-700">{result.skipped}</p>
                  <p className="text-sm text-yellow-600 font-medium">Skipped (duplicates)</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
                <XCircle size={28} className="text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-3xl font-bold text-red-700">{result.errors.length}</p>
                  <p className="text-sm text-red-600 font-medium">Errors</p>
                </div>
              </div>
            </div>

            {/* Error list */}
            {result.errors.length > 0 && (
              <div className="bg-white border border-red-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                  <h3 className="font-semibold text-red-700 flex items-center gap-2">
                    <XCircle size={16} /> Errors — these rows were not imported
                  </h3>
                </div>
                <div className="divide-y divide-red-50 max-h-60 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <p key={i} className="px-6 py-3 text-sm text-red-600">{err}</p>
                  ))}
                </div>
              </div>
            )}

            {result.created > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  Successfully imported {result.created} {tab.label.toLowerCase()} into the system.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d5f8a] transition-colors">
                <Upload size={15} /> Import Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
