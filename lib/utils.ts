import { format } from "date-fns";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "MMMM d, yyyy");
}

export function formatRegisterRef(
  bookNumber: number,
  pageNumber: number,
  entryNumber: number
): string {
  return `Book ${bookNumber}, Page ${pageNumber}, Entry ${entryNumber}`;
}

export function getNextRegisterEntry(
  entries: { bookNumber: number; pageNumber: number; entryNumber: number }[]
) {
  if (entries.length === 0) return { bookNumber: 1, pageNumber: 1, entryNumber: 1 };
  const last = entries[entries.length - 1];
  let { bookNumber, pageNumber, entryNumber } = last;
  entryNumber++;
  if (entryNumber > 50) { entryNumber = 1; pageNumber++; }
  if (pageNumber > 100) { pageNumber = 1; bookNumber++; }
  return { bookNumber, pageNumber, entryNumber };
}

export function fullName(student: {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}): string {
  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");
}

export const ROLES = {
  PASTOR: "PASTOR",
  SECRETARY: "SECRETARY",
  CATECHIST: "CATECHIST",
} as const;

export type Role = keyof typeof ROLES;
