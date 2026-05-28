import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getNextRegisterEntry } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const records = await prisma.baptismRecord.findMany({
    where: search
      ? {
          OR: [
            { student: { firstName: { contains: search } } },
            { student: { lastName: { contains: search } } },
            { minister: { contains: search } },
            { placeOfBaptism: { contains: search } },
          ],
        }
      : undefined,
    include: { student: true, registerBook: true },
    orderBy: { dateOfBaptism: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const lastEntry = await prisma.registerBook.findFirst({
    where: { type: "BAPTISM" },
    orderBy: [{ bookNumber: "desc" }, { pageNumber: "desc" }, { entryNumber: "desc" }],
  });

  const next = getNextRegisterEntry(lastEntry ? [lastEntry] : []);

  const result = await prisma.$transaction(async (tx) => {
    const registerBook = await tx.registerBook.create({
      data: { type: "BAPTISM", ...next },
    });

    const record = await tx.baptismRecord.create({
      data: {
        studentId:      body.studentId,
        registerBookId: registerBook.id,
        dateOfBaptism:  new Date(body.dateOfBaptism),
        placeOfBaptism: body.placeOfBaptism,
        diocese:        body.diocese        || null,
        minister:       body.minister,
        godfatherName:  body.godfatherName,
        godmotherName:  body.godmotherName,
        witnesses:      body.witnesses      || null,
        marginalNotes:  body.marginalNotes  || null,
        // 1st Communion
        firstCommunionDate:  body.firstCommunionDate  ? new Date(body.firstCommunionDate)  : null,
        firstCommunionPlace: body.firstCommunionPlace || null,
        // Marriage
        marriageDate:  body.marriageDate  ? new Date(body.marriageDate)  : null,
        marriagePlace: body.marriagePlace || null,
        marriageNo:    body.marriageNo    || null,
        // Husband
        husbandName:        body.husbandName        || null,
        husbandBaptismDate: body.husbandBaptismDate ? new Date(body.husbandBaptismDate) : null,
        husbandBaptismNo:   body.husbandBaptismNo   || null,
        // Wife
        wifeName:        body.wifeName        || null,
        wifeBaptismDate: body.wifeBaptismDate ? new Date(body.wifeBaptismDate) : null,
        wifeBaptismNo:   body.wifeBaptismNo   || null,
        // Sign-off
        signedBy: body.signedBy || null,
      },
      include: { student: true, registerBook: true },
    });

    return record;
  });

  return NextResponse.json(result, { status: 201 });
}
