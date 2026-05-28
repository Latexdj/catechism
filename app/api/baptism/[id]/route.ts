import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const record = await prisma.baptismRecord.findUnique({
    where: { id },
    include: { student: true, registerBook: true },
  });

  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const record = await prisma.baptismRecord.update({
    where: { id },
    data: {
      dateOfBaptism: new Date(body.dateOfBaptism),
      placeOfBaptism: body.placeOfBaptism,
      diocese: body.diocese || null,
      minister: body.minister,
      godfatherName: body.godfatherName,
      godmotherName: body.godmotherName,
      witnesses: body.witnesses || null,
      marginalNotes: body.marginalNotes || null,
    },
    include: { student: true, registerBook: true },
  });

  return NextResponse.json(record);
}
