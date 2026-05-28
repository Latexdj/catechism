import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalStudents,
    totalBaptisms,
    totalConfirmations,
    totalClasses,
    pendingNotifications,
    recentBaptisms,
    recentConfirmations,
  ] = await Promise.all([
    prisma.student.count({ where: { isArchived: false } }),
    prisma.baptismRecord.count(),
    prisma.confirmationRecord.count(),
    prisma.catechismClass.count({ where: { isActive: true } }),
    prisma.confirmationRecord.count({ where: { notificationStatus: "PENDING" } }),
    prisma.baptismRecord.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: true, registerBook: true },
    }),
    prisma.confirmationRecord.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: true, registerBook: true },
    }),
  ]);

  return NextResponse.json({
    stats: { totalStudents, totalBaptisms, totalConfirmations, totalClasses, pendingNotifications },
    recentBaptisms,
    recentConfirmations,
  });
}
