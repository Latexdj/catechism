// Column definitions and sample data for each import template

export type TemplateType = "students" | "baptism" | "confirmation";

export interface ColumnDef {
  key: string;
  label: string;
  required: boolean;
  hint?: string;
}

// ─── Students ────────────────────────────────────────────────────────────────

export const STUDENT_COLUMNS: ColumnDef[] = [
  { key: "lastName",     label: "Last Name",                     required: true  },
  { key: "firstName",    label: "First Name",                    required: true  },
  { key: "middleName",   label: "Middle Name",                   required: false },
  { key: "dateOfBirth",  label: "Date of Birth (YYYY-MM-DD)",    required: true  },
  { key: "placeOfBirth", label: "Place of Birth",                required: false },
  { key: "address",      label: "Address",                       required: false },
  { key: "contactNumber",label: "Contact Number",                required: false },
  { key: "email",        label: "Email",                         required: false },
  { key: "fatherName",   label: "Father's Full Name",            required: false },
  { key: "motherName",   label: "Mother's Full Name (incl. maiden name)", required: false },
  { key: "notes",        label: "Notes",                         required: false },
];

const STUDENT_SAMPLES = [
  ["Dela Cruz", "Jose", "Maria",    "2010-03-15", "Manila",      "123 Rizal St., Manila",    "09171234567", "jose@email.com",  "Pedro Dela Cruz", "Rosario Reyes de la Cruz", ""],
  ["Santos",    "Maria","Clara",    "2009-07-22", "Quezon City", "456 Mabini Ave., QC",      "",            "",               "Roberto Santos",  "Luz Gomez de Santos",      ""],
  ["Reyes",     "Juan", "Carlos",   "2011-11-05", "Cebu City",   "789 Colon St., Cebu",      "09281234567", "",               "Miguel Reyes",    "Carmen Torres de Reyes",   "Transferred from another parish"],
];

// ─── Baptism ─────────────────────────────────────────────────────────────────

export const BAPTISM_COLUMNS: ColumnDef[] = [
  { key: "lastName",      label: "Last Name",                    required: true  },
  { key: "firstName",     label: "First Name",                   required: true  },
  { key: "middleName",    label: "Middle Name",                  required: false },
  { key: "dateOfBirth",   label: "Date of Birth (YYYY-MM-DD)",   required: false },
  { key: "fatherName",    label: "Father's Full Name",           required: false },
  { key: "motherName",    label: "Mother's Full Name",           required: false },
  { key: "dateOfBaptism", label: "Date of Baptism (YYYY-MM-DD)", required: true  },
  { key: "placeOfBaptism",label: "Place of Baptism (Church)",    required: true  },
  { key: "diocese",       label: "Diocese",                      required: false },
  { key: "minister",      label: "Minister (Priest/Deacon)",     required: true  },
  { key: "godfatherName", label: "Godfather (Padrino)",          required: true  },
  { key: "godmotherName", label: "Godmother (Madrina)",          required: true  },
  { key: "witnesses",     label: "Witnesses",                    required: false },
  { key: "marginalNotes", label: "Marginal Notes",               required: false },
];

const BAPTISM_SAMPLES = [
  ["Dela Cruz","Jose", "Maria",  "2010-03-15","Pedro Dela Cruz","Rosario Reyes de la Cruz","2010-04-10","St. Joseph Parish","Archdiocese of Manila","Fr. Miguel Ramos","Antonio Reyes","Elena Santos","Juan Bautista",""],
  ["Santos",   "Maria","Clara",  "2009-07-22","Roberto Santos", "Luz Gomez de Santos",     "2009-08-15","Holy Rosary Parish","Archdiocese of Manila","Fr. Carlos Mendoza","Ricardo Gomez","Pilar Santos","",""],
  ["Reyes",    "Juan", "Carlos", "2011-11-05","Miguel Reyes",   "Carmen Torres de Reyes",  "2011-12-08","San Isidro Parish","Diocese of Cebu",       "Fr. Antonio Cruz","Ernesto Flores","Marilou Santos","",""],
];

// ─── Confirmation ─────────────────────────────────────────────────────────────

export const CONFIRMATION_COLUMNS: ColumnDef[] = [
  { key: "lastName",              label: "Last Name",                         required: true  },
  { key: "firstName",             label: "First Name",                        required: true  },
  { key: "middleName",            label: "Middle Name",                       required: false },
  { key: "dateOfBirth",           label: "Date of Birth (YYYY-MM-DD)",        required: false },
  { key: "dateOfConfirmation",    label: "Date of Confirmation (YYYY-MM-DD)", required: true  },
  { key: "placeOfConfirmation",   label: "Place of Confirmation (Church)",    required: true  },
  { key: "diocese",               label: "Diocese",                           required: false },
  { key: "confirmingBishop",      label: "Confirming Bishop",                 required: true  },
  { key: "sponsorName",           label: "Sponsor",                           required: true  },
  { key: "confirmationSaintName", label: "Confirmation Saint Name",           required: true  },
  { key: "baptismalParish",       label: "Baptismal Parish",                  required: true  },
  { key: "baptismalBookRef",      label: "Baptismal Book Reference",          required: false },
];

const CONFIRMATION_SAMPLES = [
  ["Dela Cruz","Jose", "Maria",  "2010-03-15","2024-05-12","St. Joseph Parish","Archdiocese of Manila","Most Rev. Antonio Tagle","Miguel Santos",  "Francis","St. Joseph Parish","Book 1, Page 1, Entry 1"],
  ["Santos",   "Maria","Clara",  "2009-07-22","2024-05-12","St. Joseph Parish","Archdiocese of Manila","Most Rev. Antonio Tagle","Carla Dela Cruz","Teresa","Holy Rosary Parish","Book 1, Page 1, Entry 2"],
  ["Reyes",    "Juan", "Carlos", "2011-11-05","2024-06-01","San Isidro Parish","Diocese of Cebu",      "Most Rev. Jose Palma",  "Roberto Reyes",  "John",  "San Isidro Parish", ""],
];

// ─── CSV generation ───────────────────────────────────────────────────────────

function escapeCell(val: string) {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function buildCSV(columns: ColumnDef[], samples: string[][]): string {
  const instructionRow = columns.map((c) => `${c.label}${c.required ? " *" : ""}`).map(escapeCell).join(",");
  const dataRows = samples.map((row) => row.map(escapeCell).join(","));
  return [instructionRow, ...dataRows].join("\r\n");
}

export function downloadTemplate(type: TemplateType) {
  let columns: ColumnDef[];
  let samples: string[][];
  let filename: string;

  if (type === "students") {
    columns = STUDENT_COLUMNS; samples = STUDENT_SAMPLES; filename = "students_import_template.csv";
  } else if (type === "baptism") {
    columns = BAPTISM_COLUMNS; samples = BAPTISM_SAMPLES; filename = "baptism_import_template.csv";
  } else {
    columns = CONFIRMATION_COLUMNS; samples = CONFIRMATION_SAMPLES; filename = "confirmation_import_template.csv";
  }

  const csv = buildCSV(columns, samples);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateRow(
  row: Record<string, string>,
  columns: ColumnDef[],
  index: number
): string[] {
  const errors: string[] = [];
  for (const col of columns) {
    if (col.required && !row[col.label.replace(" *", "")]?.trim() &&
        !row[col.label]?.trim()) {
      errors.push(`Row ${index + 1}: "${col.label}" is required`);
    }
  }
  const dateFields = ["dateOfBirth", "dateOfBaptism", "dateOfConfirmation"];
  for (const field of dateFields) {
    const labelMatch = columns.find((c) => c.key === field);
    if (!labelMatch) continue;
    const val = row[labelMatch.label]?.trim() || row[`${labelMatch.label} *`]?.trim();
    if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      errors.push(`Row ${index + 1}: "${labelMatch.label}" must be YYYY-MM-DD`);
    }
  }
  return errors;
}
