import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface StudentRow {
  lastName: string;
  firstName: string;
  middleName?: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows }: { rows: StudentRow[] } = await req.json();

  const results = { created: 0, skipped: 0, errors: [] as string[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Skip if student with same name + DOB already exists
      const existing = await prisma.student.findFirst({
        where: {
          firstName: { equals: row.firstName.trim(), mode: "insensitive" },
          lastName:  { equals: row.lastName.trim(),  mode: "insensitive" },
          dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : undefined,
        },
      });

      if (existing) { results.skipped++; continue; }

      await prisma.student.create({
        data: {
          firstName:     row.firstName.trim(),
          lastName:      row.lastName.trim(),
          middleName:    row.middleName?.trim()    || null,
          dateOfBirth:   new Date(row.dateOfBirth),
          placeOfBirth:  row.placeOfBirth?.trim()  || null,
          address:       row.address?.trim()        || null,
          contactNumber: row.contactNumber?.trim()  || null,
          email:         row.email?.trim()          || null,
          fatherName:    row.fatherName?.trim()     || null,
          motherName:    row.motherName?.trim()     || null,
          notes:         row.notes?.trim()          || null,
        },
      });
      results.created++;
    } catch (e) {
      results.errors.push(`Row ${i + 2}: ${(e as Error).message}`);
    }
  }

  return NextResponse.json(results);
}
