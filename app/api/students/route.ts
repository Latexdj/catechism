import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const archived = searchParams.get("archived") === "true";

  const students = await prisma.student.findMany({
    where: {
      isArchived: archived,
      OR: search
        ? [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { middleName: { contains: search } },
          ]
        : undefined,
    },
    include: {
      baptism: { include: { registerBook: true } },
      confirmation: { include: { registerBook: true } },
      classMembers: { include: { class: true } },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const student = await prisma.student.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      dateOfBirth: new Date(body.dateOfBirth),
      placeOfBirth: body.placeOfBirth || null,
      address: body.address || null,
      contactNumber: body.contactNumber || null,
      email: body.email || null,
      fatherName: body.fatherName || null,
      motherName: body.motherName || null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(student, { status: 201 });
}
