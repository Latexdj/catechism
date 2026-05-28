import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const cls = await prisma.catechismClass.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          student: {
            include: {
              baptism: { include: { registerBook: true } },
              confirmation: { include: { registerBook: true } },
            },
          },
        },
      },
    },
  });

  if (!cls) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cls);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Handle adding/removing members
  if (body.action === "addMember") {
    const member = await prisma.classMember.upsert({
      where: { classId_studentId: { classId: id, studentId: body.studentId } },
      update: {},
      create: { classId: id, studentId: body.studentId },
    });
    return NextResponse.json(member);
  }

  if (body.action === "removeMember") {
    await prisma.classMember.delete({
      where: { classId_studentId: { classId: id, studentId: body.studentId } },
    });
    return NextResponse.json({ success: true });
  }

  const cls = await prisma.catechismClass.update({
    where: { id },
    data: {
      name: body.name,
      year: parseInt(body.year),
      sacramentType: body.sacramentType,
      catechist: body.catechist || null,
      description: body.description || null,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(cls);
}
