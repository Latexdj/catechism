import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getNextRegisterEntry } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const records = await prisma.confirmationRecord.findMany({
    where: search
      ? {
          OR: [
            { student: { firstName: { contains: search } } },
            { student: { lastName: { contains: search } } },
            { confirmingBishop: { contains: search } },
            { baptismalParish: { contains: search } },
          ],
        }
      : undefined,
    include: { student: true, registerBook: true },
    orderBy: { dateOfConfirmation: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const lastEntry = await prisma.registerBook.findFirst({
    where: { type: "CONFIRMATION" },
    orderBy: [{ bookNumber: "desc" }, { pageNumber: "desc" }, { entryNumber: "desc" }],
  });

  const next = getNextRegisterEntry(lastEntry ? [lastEntry] : []);

  const result = await prisma.$transaction(async (tx) => {
    const registerBook = await tx.registerBook.create({
      data: { type: "CONFIRMATION", ...next },
    });

    const record = await tx.confirmationRecord.create({
      data: {
        studentId: body.studentId,
        registerBookId: registerBook.id,
        dateOfConfirmation: new Date(body.dateOfConfirmation),
        placeOfConfirmation: body.placeOfConfirmation,
        diocese: body.diocese || null,
        confirmingBishop: body.confirmingBishop,
        sponsorName: body.sponsorName,
        confirmationSaintName: body.confirmationSaintName,
        baptismalParish: body.baptismalParish,
        baptismalBookRef: body.baptismalBookRef || null,
        notificationStatus: "PENDING",
      },
      include: { student: true, registerBook: true },
    });

    // Add marginal note to baptism record if it exists
    if (body.updateBaptismRecord) {
      await tx.baptismRecord.updateMany({
        where: { studentId: body.studentId },
        data: {
          marginalNotes: `Confirmed: ${new Date(body.dateOfConfirmation).toLocaleDateString()} at ${body.placeOfConfirmation}`,
        },
      });
    }

    return record;
  });

  return NextResponse.json(result, { status: 201 });
}
