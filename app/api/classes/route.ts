import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classes = await prisma.catechismClass.findMany({
    include: {
      members: { include: { student: true } },
    },
    orderBy: [{ year: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const cls = await prisma.catechismClass.create({
    data: {
      name: body.name,
      year: parseInt(body.year),
      sacramentType: body.sacramentType,
      catechist: body.catechist || null,
      description: body.description || null,
    },
  });

  return NextResponse.json(cls, { status: 201 });
}
