import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing all sacramental records and students...");

  await prisma.classMember.deleteMany();
  await prisma.catechismClass.deleteMany();
  await prisma.confirmationRecord.deleteMany();
  await prisma.baptismRecord.deleteMany();
  await prisma.registerBook.deleteMany();
  await prisma.student.deleteMany();

  console.log("Done. All records cleared. Login accounts kept.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
