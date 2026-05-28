import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const record = await prisma.confirmationRecord.findUnique({
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

  const record = await prisma.confirmationRecord.update({
    where: { id },
    data: {
      dateOfConfirmation: new Date(body.dateOfConfirmation),
      placeOfConfirmation: body.placeOfConfirmation,
      diocese: body.diocese || null,
      confirmingBishop: body.confirmingBishop,
      sponsorName: body.sponsorName,
      confirmationSaintName: body.confirmationSaintName,
      baptismalParish: body.baptismalParish,
      baptismalBookRef: body.baptismalBookRef || null,
      notificationStatus: body.notificationStatus,
      notificationSentAt: body.notificationSentAt ? new Date(body.notificationSentAt) : null,
    },
    include: { student: true, registerBook: true },
  });

  return NextResponse.json(record);
}
