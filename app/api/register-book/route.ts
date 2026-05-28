import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getNextRegisterEntry } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = new URL(req.url).searchParams.get("type") || "BAPTISM";

  const lastEntry = await prisma.registerBook.findFirst({
    where: { type },
    orderBy: [{ bookNumber: "desc" }, { pageNumber: "desc" }, { entryNumber: "desc" }],
  });

  const next = getNextRegisterEntry(lastEntry ? [lastEntry] : []);
  return NextResponse.json(next);
}
