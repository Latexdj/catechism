import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getNextRegisterEntry } from "@/lib/utils";

interface ConfirmationRow {
  lastName: string;
  firstName: string;
  middleName?: string;
  dateOfBirth?: string;
  dateOfConfirmation: string;
  placeOfConfirmation: string;
  diocese?: string;
  confirmingBishop: string;
  sponsorName: string;
  confirmationSaintName: string;
  baptismalParish: string;
  baptismalBookRef?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows }: { rows: ConfirmationRow[] } = await req.json();

  const results = { created: 0, skipped: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Find or create student
      let student = await prisma.student.findFirst({
        where: {
          firstName: { equals: row.firstName.trim(), mode: "insensitive" },
          lastName:  { equals: row.lastName.trim(),  mode: "insensitive" },
        },
      });

      if (!student) {
        student = await prisma.student.create({
          data: {
            firstName:   row.firstName.trim(),
            lastName:    row.lastName.trim(),
            middleName:  row.middleName?.trim() || null,
            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : new Date("2000-01-01"),
          },
        });
      }

      // Skip if confirmation record already exists
      const existing = await prisma.confirmationRecord.findUnique({ where: { studentId: student.id } });
      if (existing) { results.skipped++; continue; }

      // Get next register book entry
      const lastEntry = await prisma.registerBook.findFirst({
        where: { type: "CONFIRMATION" },
        orderBy: [{ bookNumber: "desc" }, { pageNumber: "desc" }, { entryNumber: "desc" }],
      });
      const next = getNextRegisterEntry(lastEntry ? [lastEntry] : []);

      await prisma.$transaction(async (tx) => {
        const registerBook = await tx.registerBook.create({
          data: { type: "CONFIRMATION", ...next },
        });
        await tx.confirmationRecord.create({
          data: {
            studentId:             student!.id,
            registerBookId:        registerBook.id,
            dateOfConfirmation:    new Date(row.dateOfConfirmation),
            placeOfConfirmation:   row.placeOfConfirmation.trim(),
            diocese:               row.diocese?.trim()            || null,
            confirmingBishop:      row.confirmingBishop.trim(),
            sponsorName:           row.sponsorName.trim(),
            confirmationSaintName: row.confirmationSaintName.trim(),
            baptismalParish:       row.baptismalParish.trim(),
            baptismalBookRef:      row.baptismalBookRef?.trim()   || null,
            notificationStatus:    "PENDING",
          },
        });
      });

      results.created++;
    } catch (e) {
      results.errors.push(`Row ${i + 2}: ${(e as Error).message}`);
    }
  }

  return NextResponse.json(results);
}
