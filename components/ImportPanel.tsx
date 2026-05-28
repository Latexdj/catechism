"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import {
  X,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";
import {
  downloadTemplate,
  STUDENT_COLUMNS,
  BAPTISM_COLUMNS,
  CONFIRMATION_COLUMNS,
  type TemplateType,
  type ColumnDef,
} from "@/lib/importTemplates";

// ─── Config per type ──────────────────────────────────────────────────────────

const CONFIG: Record<
  TemplateType,
  { title: string; columns: ColumnDef[]; apiPath: string; templateFile: string }
> = {
  students: {
    title: "Import Student Records",
    columns: STUDENT_COLUMNS,
    apiPath: "/api/import/students",
    templateFile: "students_import_template.csv",
  },
  baptism: {
    title: "Import Baptism Records",
    columns: BAPTISM_COLUMNS,
    apiPath: "/api/import/baptism",
    templateFile: "baptism_import_template.csv",
  },
  confirmation: {
    title: "Import Confirmation Records",
    columns: CONFIRMATION_COLUMNS,
    apiPath: "/api/import/confirmation",
    templateFile: "confirmation_import_template.csv",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "start" | "preview" | "result";

interface ImportResult {
  created: number;
  skipped: number;
  errors: string[];
}

interface Props {
  type: TemplateType;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImportPanel({ type, open, onClose, onSuccess }: Props) {
  const cfg = CONFIG[type];
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("start");
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [parseError, setParseError] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  function reset() {
    setStep("start");
    setFileName("");
    setParsedRows([]);
    setParseError("");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    reset();
    onClose();
  }

  function mapRow(raw: Record<string, string>): Record<string, string> {
    const mapped: Record<string, string> = {};
    for (const col of cfg.columns) {
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
        setParsedRows((res.data as Record<string, string>[]).map(mapRow));
        setStep("preview");
      },
      error: (err) => setParseError(err.message),
    });
  }

  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch(cfg.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedRows }),
      });
      const data: ImportResult = await res.json();
      setResult(data);
      setStep("result");
      if (data.created > 0) onSuccess?.();
    } catch {
      setResult({ created: 0, skipped: 0, errors: ["Network error. Please try again."] });
      setStep("result");
    }
    setImporting(false);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#1e3a5f] text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileSpreadsheet size={20} className="text-[#c9a84c]" />
            <h2 className="font-bold text-base">{cfg.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">

          {/* ══ START ══ */}
          {step === "start" && (
            <div className="p-6 space-y-6">

              {/* Step 1 — Download */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <h3 className="font-semibold text-gray-800">Download the Template</h3>
                </div>
                <p className="text-sm text-gray-500 ml-8">
                  Download and open in Excel or Google Sheets. Fill in your data — columns marked
                  <span className="text-red-500 font-bold"> * </span>
                  are required. Delete the sample rows before uploading.
                </p>
                <div className="ml-8">
                  <button
                    onClick={() => downloadTemplate(type)}
                    className="flex items-center gap-2.5 border-2 border-[#1e3a5f] text-[#1e3a5f] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1e3a5f] hover:text-white transition-colors"
                  >
                    <Download size={16} />
                    Download {cfg.templateFile}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Column reference */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-8">
                  Columns in this template
                </p>
                <div className="ml-8 grid grid-cols-1 gap-1.5">
                  {cfg.columns.map((col) => (
                    <div key={col.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {col.label}
                        {col.required && <span className="text-red-500 ml-0.5">*</span>}
                      </span>
                      {!col.required && (
                        <span className="text-xs text-gray-300">optional</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Step 2 — Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <h3 className="font-semibold text-gray-800">Upload your completed file</h3>
                </div>
                <div className="ml-8">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFile}
                    className="hidden"
                    id={`file-${type}`}
                  />
                  <label
                    htmlFor={`file-${type}`}
                    className="flex items-center gap-2.5 bg-[#c9a84c] text-[#1e3a5f] px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#b8973b] transition-colors"
                  >
                    <Upload size={16} />
                    Choose CSV File
                  </label>

                  {fileName && (
                    <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                      {fileName}
                    </p>
                  )}
                  {parseError && (
                    <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                      <XCircle size={15} className="flex-shrink-0" />
                      {parseError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ PREVIEW ══ */}
          {step === "preview" && (
            <div className="p-6 space-y-5">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1e3a5f] text-lg">{parsedRows.length} records</p>
                  <p className="text-sm text-gray-500">{fileName}</p>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </div>

              {/* Preview table */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                  Preview — first 5 rows
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {cfg.columns.slice(0, 4).map((col) => (
                            <th key={col.key} className="px-3 py-2.5 text-left text-gray-500 font-semibold whitespace-nowrap">
                              {col.label.split(" (")[0]}
                              {col.required && <span className="text-red-400">*</span>}
                            </th>
                          ))}
                          {cfg.columns.length > 4 && (
                            <th className="px-3 py-2.5 text-gray-400 font-medium">+{cfg.columns.length - 4} more</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {parsedRows.slice(0, 5).map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {cfg.columns.slice(0, 4).map((col) => (
                              <td
                                key={col.key}
                                className={`px-3 py-2.5 whitespace-nowrap ${
                                  col.required && !row[col.key]
                                    ? "text-red-500 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {row[col.key] || (col.required ? "⚠ Missing" : "—")}
                              </td>
                            ))}
                            {cfg.columns.length > 4 && <td className="px-3 py-2.5 text-gray-300">…</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedRows.length > 5 && (
                    <p className="px-3 py-2 text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
                      + {parsedRows.length - 5} more rows
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => { reset(); }}
                className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
              >
                ← Upload a different file
              </button>
            </div>
          )}

          {/* ══ RESULT ══ */}
          {step === "result" && result && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{result.created}</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">Created</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
                  <p className="text-xs text-yellow-600 font-medium mt-0.5">Skipped</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-700">{result.errors.length}</p>
                  <p className="text-xs text-red-600 font-medium mt-0.5">Errors</p>
                </div>
              </div>

              {result.created > 0 && (
                <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-medium">
                    {result.created} record{result.created !== 1 ? "s" : ""} successfully imported.
                  </p>
                </div>
              )}

              {result.skipped > 0 && (
                <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    {result.skipped} row{result.skipped !== 1 ? "s" : ""} skipped — records already exist in the system.
                  </p>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="border border-red-100 rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 flex items-center gap-2">
                    <XCircle size={15} className="text-red-500" />
                    <p className="text-sm font-semibold text-red-700">
                      {result.errors.length} row{result.errors.length !== 1 ? "s" : ""} failed
                    </p>
                  </div>
                  <div className="divide-y divide-red-50 max-h-48 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <p key={i} className="px-4 py-2.5 text-xs text-red-600">{err}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm text-[#1e3a5f] font-semibold hover:underline"
              >
                <Upload size={14} /> Import another file
              </button>
            </div>
          )}
        </div>

        {/* Footer — action button */}
        {step === "preview" && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3 rounded-xl font-bold hover:bg-[#2d5f8a] disabled:opacity-60 transition-colors"
            >
              {importing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Import {parsedRows.length} Record{parsedRows.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold bg-[#1e3a5f] text-white hover:bg-[#2d5f8a] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}
