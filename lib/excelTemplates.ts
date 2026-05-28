import type { TemplateType, ColumnDef } from "./importTemplates";
import {
  STUDENT_COLUMNS,
  BAPTISM_COLUMNS,
  CONFIRMATION_COLUMNS,
} from "./importTemplates";

// ─── Palette ─────────────────────────────────────────────────────────────────

const NAVY   = "FF1E3A5F";
const GOLD   = "FFC9A84C";
const WHITE  = "FFFFFFFF";
const LIGHT_GOLD = "FFFFF8E7";
const REQ_HEADER_BG = "FF1E3A5F";
const OPT_HEADER_BG = "FFD6E0EA";
const OPT_HEADER_FG = "FF1E3A5F";
const SAMPLE_BG     = "FFF5F5F5";
const SAMPLE_FG     = "FF999999";
const ROW_ALT_BG    = "FFF0F5FB";
const BORDER_COLOR  = "FFCCCCCC";

// ─── Config per type ──────────────────────────────────────────────────────────

const CONFIG: Record<TemplateType, {
  title: string;
  subtitle: string;
  columns: ColumnDef[];
  samples: string[][];
  widths: number[];
}> = {
  students: {
    title: "STUDENT RECORDS — IMPORT TEMPLATE",
    subtitle: "Use this file to bulk import student personal information into the Parish Records System.",
    columns: STUDENT_COLUMNS,
    widths:  [20, 20, 18, 18, 20, 30, 16, 25, 28, 32, 25],
    samples: [
      ["Dela Cruz","Jose","Maria","2010-03-15","Manila","123 Rizal St., Sampaloc, Manila","09171234567","jose@email.com","Pedro Dela Cruz","Rosario Reyes de la Cruz",""],
      ["Santos","Maria","Clara","2009-07-22","Quezon City","456 Mabini Ave., Quezon City","","","Roberto Santos","Luz Gomez de Santos",""],
      ["Reyes","Juan","Carlos","2011-11-05","Cebu City","789 Colon St., Cebu","09281234567","","Miguel Reyes","Carmen Torres de Reyes","Transferred from another parish"],
    ],
  },
  baptism: {
    title: "BAPTISM RECORDS — IMPORT TEMPLATE",
    subtitle: "Use this file to bulk import baptism records. Students will be created automatically if not found in the system.",
    columns: BAPTISM_COLUMNS,
    widths:  [20, 20, 18, 18, 28, 32, 24, 18, 28, 28, 28, 30, 25],
    samples: [
      ["Dela Cruz","Jose","Maria","2010-03-15","Pedro Dela Cruz","Rosario Reyes de la Cruz","2010-04-10","St. Joseph Parish","Archdiocese of Manila","Fr. Miguel Ramos","Antonio Reyes","Elena Santos","Juan Bautista, Carmen Lopez",""],
      ["Santos","Maria","Clara","2009-07-22","Roberto Santos","Luz Gomez de Santos","2009-08-15","Holy Rosary Parish","Archdiocese of Manila","Fr. Carlos Mendoza","Ricardo Gomez","Pilar Santos","",""],
      ["Reyes","Juan","Carlos","2011-11-05","Miguel Reyes","Carmen Torres de Reyes","2011-12-08","San Isidro Parish","Diocese of Cebu","Fr. Antonio Cruz","Ernesto Flores","Marilou Santos","",""],
    ],
  },
  confirmation: {
    title: "CONFIRMATION RECORDS — IMPORT TEMPLATE",
    subtitle: "Use this file to bulk import confirmation records. Students will be created automatically if not found in the system.",
    columns: CONFIRMATION_COLUMNS,
    widths:  [20, 20, 18, 18, 20, 28, 24, 30, 28, 26, 28, 28],
    samples: [
      ["Dela Cruz","Jose","Maria","2010-03-15","2024-05-12","St. Joseph Parish","Archdiocese of Manila","Most Rev. Antonio Cardinal Tagle","Miguel Santos","Francis","St. Joseph Parish","Book 1, Page 1, Entry 1"],
      ["Santos","Maria","Clara","2009-07-22","2024-05-12","St. Joseph Parish","Archdiocese of Manila","Most Rev. Antonio Cardinal Tagle","Carla Dela Cruz","Teresa","Holy Rosary Parish","Book 1, Page 1, Entry 2"],
      ["Reyes","Juan","Carlos","2011-11-05","2024-06-01","San Isidro Parish","Diocese of Cebu","Most Rev. Jose Palma","Roberto Reyes","John","San Isidro Parish",""],
    ],
  },
};

// ─── Helper: apply thin border to a cell ─────────────────────────────────────

function border(cell: import("exceljs").Cell) {
  const side = { style: "thin" as const, color: { argb: BORDER_COLOR } };
  cell.border = { top: side, left: side, bottom: side, right: side };
}

// ─── Main generator ───────────────────────────────────────────────────────────

export async function downloadExcelTemplate(type: TemplateType) {
  // Lazy-load ExcelJS so it doesn't bloat the initial bundle
  const ExcelJS = (await import("exceljs")).default;

  const cfg = CONFIG[type];
  const cols = cfg.columns;
  const numCols = cols.length;
  const lastColLetter = String.fromCharCode(64 + numCols); // A=65

  const wb = new ExcelJS.Workbook();
  wb.creator = "Parish Records System";
  wb.created = new Date();

  // ── Sheet 1: Instructions ──────────────────────────────────────────────────

  const info = wb.addWorksheet("Instructions", {
    properties: { defaultColWidth: 70, tabColor: { argb: NAVY } },
  });

  info.getColumn(1).width = 5;
  info.getColumn(2).width = 70;

  // Parish header
  const h1 = info.getCell("B2");
  h1.value = "✝  ROMAN CATHOLIC PARISH RECORDS SYSTEM";
  h1.font = { name: "Calibri", size: 18, bold: true, color: { argb: WHITE } };
  h1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  h1.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
  info.getRow(2).height = 44;

  // Template title
  const h2 = info.getCell("B3");
  h2.value = cfg.title;
  h2.font = { name: "Calibri", size: 13, bold: true, color: { argb: NAVY } };
  h2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
  h2.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
  info.getRow(3).height = 30;

  // How to use
  const steps = [
    ["STEP 1 — DOWNLOAD", "This file is your import template. Do not rename the 'Data Entry' sheet."],
    ["STEP 2 — FILL IN DATA", "Click the 'Data Entry' tab below. Fill in your records starting from row 8. Delete the 3 sample rows (rows 5, 6, 7) before uploading."],
    ["STEP 3 — REQUIRED FIELDS", "Columns with a dark navy header are REQUIRED. Leave them blank and the row will be skipped."],
    ["STEP 4 — DATE FORMAT", "All dates must be entered as YYYY-MM-DD (e.g. 2024-05-12). Wrong format will cause import errors."],
    ["STEP 5 — SAVE & UPLOAD", "Save this file as-is (.xlsx) or export as CSV. Then open the app, go to the relevant page, click 'Upload Records' and select your file."],
    ["DUPLICATES", "The system skips rows where the record already exists, so it is safe to re-upload the same file."],
  ];

  steps.forEach(([title, desc], i) => {
    const row = info.getRow(5 + i * 2);
    row.height = 22;
    const t = info.getCell(`B${5 + i * 2}`);
    t.value = title;
    t.font = { name: "Calibri", size: 10, bold: true, color: { argb: NAVY } };
    t.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GOLD } };
    t.alignment = { vertical: "middle", indent: 1 };

    const d = info.getCell(`B${6 + i * 2}`);
    d.value = desc;
    d.font = { name: "Calibri", size: 10, color: { argb: "FF333333" } };
    d.alignment = { vertical: "middle", indent: 2, wrapText: true };
    info.getRow(6 + i * 2).height = 28;
  });

  // Legend
  const legRow = 5 + steps.length * 2 + 1;
  info.getRow(legRow).height = 20;
  const legTitle = info.getCell(`B${legRow}`);
  legTitle.value = "COLOUR LEGEND";
  legTitle.font = { name: "Calibri", size: 10, bold: true, color: { argb: WHITE } };
  legTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  legTitle.alignment = { vertical: "middle", indent: 1 };

  const leg1 = info.getCell(`B${legRow + 1}`);
  leg1.value = "■  Dark navy header = REQUIRED field — must not be left blank";
  leg1.font = { name: "Calibri", size: 10, color: { argb: WHITE } };
  leg1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  leg1.alignment = { vertical: "middle", indent: 2 };
  info.getRow(legRow + 1).height = 22;

  const leg2 = info.getCell(`B${legRow + 2}`);
  leg2.value = "■  Light blue-grey header = OPTIONAL field — may be left blank";
  leg2.font = { name: "Calibri", size: 10, color: { argb: OPT_HEADER_FG } };
  leg2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: OPT_HEADER_BG } };
  leg2.alignment = { vertical: "middle", indent: 2 };
  info.getRow(legRow + 2).height = 22;

  const leg3 = info.getCell(`B${legRow + 3}`);
  leg3.value = "■  Grey italic rows = SAMPLE DATA — delete these rows before uploading";
  leg3.font = { name: "Calibri", size: 10, italic: true, color: { argb: SAMPLE_FG } };
  leg3.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SAMPLE_BG } };
  leg3.alignment = { vertical: "middle", indent: 2 };
  info.getRow(legRow + 3).height = 22;

  // ── Sheet 2: Data Entry ───────────────────────────────────────────────────

  const ws = wb.addWorksheet("Data Entry", {
    properties: { tabColor: { argb: GOLD } },
  });

  // Set column widths
  ws.columns = cols.map((col, i) => ({
    key: col.key,
    width: cfg.widths[i] ?? 20,
  }));

  // ── ROW 1: Title bar ──
  ws.getRow(1).height = 40;
  ws.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = ws.getCell("A1");
  titleCell.value = `✝   ${cfg.title}`;
  titleCell.font = { name: "Calibri", size: 15, bold: true, color: { argb: WHITE } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };

  // ── ROW 2: Subtitle ──
  ws.getRow(2).height = 28;
  ws.mergeCells(`A2:${lastColLetter}2`);
  const subtitleCell = ws.getCell("A2");
  subtitleCell.value = cfg.subtitle;
  subtitleCell.font = { name: "Calibri", size: 10, color: { argb: NAVY } };
  subtitleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GOLD } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "left", indent: 2, wrapText: true };

  // ── ROW 3: Warning bar ──
  ws.getRow(3).height = 22;
  ws.mergeCells(`A3:${lastColLetter}3`);
  const warnCell = ws.getCell("A3");
  warnCell.value = "⚠   Delete the 3 grey sample rows (rows 5, 6, 7) before uploading. All dates must be in YYYY-MM-DD format.";
  warnCell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF7B3F00" } };
  warnCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3CD" } };
  warnCell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };

  // ── ROW 4: Column headers ──
  ws.getRow(4).height = 30;
  cols.forEach((col, i) => {
    const cell = ws.getCell(4, i + 1);
    cell.value = col.required ? `${col.label.toUpperCase()} *` : col.label.toUpperCase();
    cell.font = {
      name: "Calibri",
      size: 9,
      bold: true,
      color: { argb: col.required ? WHITE : OPT_HEADER_FG },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: col.required ? REQ_HEADER_BG : OPT_HEADER_BG },
    };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 };
    border(cell);
  });

  // Freeze rows 1–4 so header is always visible
  ws.views = [{ state: "frozen", xSplit: 0, ySplit: 4 }];

  // ── ROWS 5–7: Sample data ──
  cfg.samples.forEach((sample, si) => {
    const rowIdx = 5 + si;
    ws.getRow(rowIdx).height = 20;
    cols.forEach((col, ci) => {
      const cell = ws.getCell(rowIdx, ci + 1);
      cell.value = si === 0 && ci === 0
        ? `[SAMPLE] ${sample[ci] ?? ""}`
        : (sample[ci] ?? "");
      cell.font = { name: "Calibri", size: 9, italic: true, color: { argb: SAMPLE_FG } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: SAMPLE_BG } };
      cell.alignment = { vertical: "middle", indent: 1 };
      border(cell);
    });
  });

  // ── ROWS 8–107: Empty data entry rows (100 rows) ──
  for (let r = 8; r <= 107; r++) {
    ws.getRow(r).height = 18;
    const isAlt = (r % 2 === 0);
    cols.forEach((_, ci) => {
      const cell = ws.getCell(r, ci + 1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isAlt ? ROW_ALT_BG : WHITE },
      };
      cell.font = { name: "Calibri", size: 9 };
      cell.alignment = { vertical: "middle", indent: 1 };
      border(cell);
    });
  }

  // ── Trigger download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}_import_template.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Parse an uploaded .xlsx file into row objects ────────────────────────────

export async function parseExcelFile(
  file: File,
  type: TemplateType
): Promise<Record<string, string>[]> {
  const ExcelJS = (await import("exceljs")).default;
  const cfg = CONFIG[type];
  const cols = cfg.columns;

  const buffer = await file.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);

  // Try "Data Entry" sheet first, then first sheet
  const ws = wb.getWorksheet("Data Entry") ?? wb.worksheets[0];
  if (!ws) throw new Error("No worksheet found in the uploaded file.");

  // Find the header row (the one that contains column label text)
  let headerRowIdx = -1;
  ws.eachRow({ includeEmpty: false }, (row, rowIdx) => {
    if (headerRowIdx !== -1) return;
    const firstCell = String(row.getCell(1).value ?? "").toUpperCase();
    // Header row contains column labels (check for known required col)
    const requiredLabel = cols[0].label.toUpperCase();
    if (firstCell.includes(requiredLabel) || firstCell.includes(requiredLabel.replace(" *", ""))) {
      headerRowIdx = rowIdx;
    }
  });

  if (headerRowIdx === -1) throw new Error("Could not find the header row. Make sure you are using the provided template.");

  // Build header map: column index → column key
  const headerRow = ws.getRow(headerRowIdx);
  const colMap: Record<number, string> = {};
  cols.forEach((col) => {
    headerRow.eachCell({ includeEmpty: false }, (cell, colIdx) => {
      const val = String(cell.value ?? "")
        .replace(" *", "")
        .replace(/[✝⚠\[\]]/g, "")
        .trim()
        .toUpperCase();
      const labelUpper = col.label.toUpperCase();
      if (val === labelUpper || val.includes(labelUpper)) {
        colMap[colIdx] = col.key;
      }
    });
  });

  // Read data rows (skip header, skip sample rows tagged [SAMPLE])
  const rows: Record<string, string>[] = [];

  ws.eachRow({ includeEmpty: false }, (row, rowIdx) => {
    if (rowIdx <= headerRowIdx) return;

    const firstVal = String(row.getCell(1).value ?? "").trim();
    // Skip sample rows
    if (firstVal.startsWith("[SAMPLE]") || firstVal === "") return;
    // Skip rows where all required cols are empty
    const mapped: Record<string, string> = {};
    row.eachCell({ includeEmpty: true }, (cell, colIdx) => {
      const key = colMap[colIdx];
      if (!key) return;
      let val = "";
      if (cell.value instanceof Date) {
        val = cell.value.toISOString().split("T")[0];
      } else if (cell.value !== null && cell.value !== undefined) {
        val = String(cell.value).trim();
        // Clean up [SAMPLE] prefix if present
        val = val.replace(/^\[SAMPLE\]\s*/i, "");
      }
      mapped[key] = val;
    });

    const hasData = cols.some((c) => mapped[c.key]?.trim());
    if (hasData) rows.push(mapped);
  });

  if (rows.length === 0) {
    throw new Error("No data rows found. Make sure you filled in data below the header row and deleted the sample rows.");
  }

  return rows;
}
