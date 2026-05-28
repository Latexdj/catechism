import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  const password = await bcrypt.hash("parish2024", 10);

  await prisma.user.upsert({
    where: { email: "pastor@parish.org" },
    update: {},
    create: { name: "Fr. John Santos", email: "pastor@parish.org", password, role: "PASTOR" },
  });

  await prisma.user.upsert({
    where: { email: "secretary@parish.org" },
    update: {},
    create: { name: "Maria dela Cruz", email: "secretary@parish.org", password, role: "SECRETARY" },
  });

  await prisma.user.upsert({
    where: { email: "catechist@parish.org" },
    update: {},
    create: { name: "Ana Reyes", email: "catechist@parish.org", password, role: "CATECHIST" },
  });

  const student1 = await prisma.student.upsert({
    where: { id: "sample-student-1" },
    update: {},
    create: {
      id: "sample-student-1",
      firstName: "Jose",
      middleName: "Maria",
      lastName: "Dela Cruz",
      dateOfBirth: new Date("2010-03-15"),
      placeOfBirth: "Manila",
      address: "123 Rizal St., Sampaloc, Manila",
      fatherName: "Pedro Dela Cruz",
      motherName: "Rosario Reyes de la Cruz",
      contactNumber: "09171234567",
    },
  });

  const student2 = await prisma.student.upsert({
    where: { id: "sample-student-2" },
    update: {},
    create: {
      id: "sample-student-2",
      firstName: "Maria",
      middleName: "Clara",
      lastName: "Santos",
      dateOfBirth: new Date("2009-07-22"),
      placeOfBirth: "Quezon City",
      address: "456 Mabini Ave., Quezon City",
      fatherName: "Roberto Santos",
      motherName: "Luz Gomez de Santos",
    },
  });

  // Baptism registers
  const bapBook1 = await prisma.registerBook.upsert({
    where: { type_bookNumber_pageNumber_entryNumber: { type: "BAPTISM", bookNumber: 1, pageNumber: 1, entryNumber: 1 } },
    update: {},
    create: { type: "BAPTISM", bookNumber: 1, pageNumber: 1, entryNumber: 1 },
  });

  await prisma.baptismRecord.upsert({
    where: { studentId: student1.id },
    update: {},
    create: {
      studentId: student1.id,
      registerBookId: bapBook1.id,
      dateOfBaptism: new Date("2010-04-10"),
      placeOfBaptism: "St. Joseph Parish",
      diocese: "Archdiocese of Manila",
      minister: "Fr. Miguel Ramos",
      godfatherName: "Antonio Reyes",
      godmotherName: "Elena Santos",
      witnesses: "Juan Bautista, Carmen Lopez",
    },
  });

  const bapBook2 = await prisma.registerBook.upsert({
    where: { type_bookNumber_pageNumber_entryNumber: { type: "BAPTISM", bookNumber: 1, pageNumber: 1, entryNumber: 2 } },
    update: {},
    create: { type: "BAPTISM", bookNumber: 1, pageNumber: 1, entryNumber: 2 },
  });

  await prisma.baptismRecord.upsert({
    where: { studentId: student2.id },
    update: {},
    create: {
      studentId: student2.id,
      registerBookId: bapBook2.id,
      dateOfBaptism: new Date("2009-08-15"),
      placeOfBaptism: "Holy Rosary Parish",
      diocese: "Archdiocese of Manila",
      minister: "Fr. Carlos Mendoza",
      godfatherName: "Ricardo Gomez",
      godmotherName: "Pilar Santos",
    },
  });

  // Confirmation for student1
  const confBook1 = await prisma.registerBook.upsert({
    where: { type_bookNumber_pageNumber_entryNumber: { type: "CONFIRMATION", bookNumber: 1, pageNumber: 1, entryNumber: 1 } },
    update: {},
    create: { type: "CONFIRMATION", bookNumber: 1, pageNumber: 1, entryNumber: 1 },
  });

  await prisma.confirmationRecord.upsert({
    where: { studentId: student1.id },
    update: {},
    create: {
      studentId: student1.id,
      registerBookId: confBook1.id,
      dateOfConfirmation: new Date("2024-05-12"),
      placeOfConfirmation: "St. Joseph Parish",
      diocese: "Archdiocese of Manila",
      confirmingBishop: "Most Rev. Antonio Cardinal Tagle",
      sponsorName: "Miguel Santos",
      confirmationSaintName: "Francis",
      baptismalParish: "St. Joseph Parish",
      baptismalBookRef: "Book 1, Page 1, Entry 1",
      notificationStatus: "SENT",
      notificationSentAt: new Date("2024-05-20"),
    },
  });

  const cls = await prisma.catechismClass.upsert({
    where: { id: "sample-class-1" },
    update: {},
    create: {
      id: "sample-class-1",
      name: "Confirmation Class 2024",
      year: 2024,
      sacramentType: "CONFIRMATION",
      catechist: "Ana Reyes",
      description: "Annual confirmation preparation class",
    },
  });

  await prisma.classMember.upsert({
    where: { classId_studentId: { classId: cls.id, studentId: student1.id } },
    update: {},
    create: { classId: cls.id, studentId: student1.id },
  });

  await prisma.classMember.upsert({
    where: { classId_studentId: { classId: cls.id, studentId: student2.id } },
    update: {},
    create: { classId: cls.id, studentId: student2.id },
  });

  console.log("\nSeed complete!");
  console.log("Login credentials:");
  console.log("  Pastor:    pastor@parish.org    / parish2024");
  console.log("  Secretary: secretary@parish.org / parish2024");
  console.log("  Catechist: catechist@parish.org / parish2024");
}

main().catch(console.error).finally(() => prisma.$disconnect());
