import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getNextRegisterEntry } from "@/lib/utils";

interface BaptismRow {
  lastName: string;
  firstName: string;
  middleName?: string;
  dateOfBirth?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBaptism: string;
  placeOfBaptism: string;
  diocese?: string;
  minister: string;
  godfatherName: string;
  godmotherName: string;
  witnesses?: string;
  marginalNotes?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows }: { rows: BaptismRow[] } = await req.json();

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
            fatherName:  row.fatherName?.trim() || null,
            motherName:  row.motherName?.trim() || null,
          },
        });
      }

      // Skip if baptism record already exists
      const existing = await prisma.baptismRecord.findUnique({ where: { studentId: student.id } });
      if (existing) { results.skipped++; continue; }

      // Get next register book entry
      const lastEntry = await prisma.registerBook.findFirst({
        where: { type: "BAPTISM" },
        orderBy: [{ bookNumber: "desc" }, { pageNumber: "desc" }, { entryNumber: "desc" }],
      });
      const next = getNextRegisterEntry(lastEntry ? [lastEntry] : []);

      await prisma.$transaction(async (tx) => {
        const registerBook = await tx.registerBook.create({
          data: { type: "BAPTISM", ...next },
        });
        await tx.baptismRecord.create({
          data: {
            studentId:      student!.id,
            registerBookId: registerBook.id,
            dateOfBaptism:  new Date(row.dateOfBaptism),
            placeOfBaptism: row.placeOfBaptism.trim(),
            diocese:        row.diocese?.trim()       || null,
            minister:       row.minister.trim(),
            godfatherName:  row.godfatherName.trim(),
            godmotherName:  row.godmotherName.trim(),
            witnesses:      row.witnesses?.trim()     || null,
            marginalNotes:  row.marginalNotes?.trim() || null,
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
