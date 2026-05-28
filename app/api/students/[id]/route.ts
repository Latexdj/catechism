import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      baptism: { include: { registerBook: true } },
      confirmation: { include: { registerBook: true } },
      classMembers: { include: { class: true } },
    },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const student = await prisma.student.update({
    where: { id },
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

  return NextResponse.json(student);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.student.update({ where: { id }, data: { isArchived: true } });
  return NextResponse.json({ success: true });
}
