-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CATECHIST',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "placeOfBirth" TEXT,
    "address" TEXT,
    "contactNumber" TEXT,
    "email" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "notes" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegisterBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "entryNumber" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BaptismRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "registerBookId" TEXT NOT NULL,
    "dateOfBaptism" DATETIME NOT NULL,
    "placeOfBaptism" TEXT NOT NULL,
    "diocese" TEXT,
    "minister" TEXT NOT NULL,
    "godfatherName" TEXT NOT NULL,
    "godmotherName" TEXT NOT NULL,
    "witnesses" TEXT,
    "marginalNotes" TEXT,
    "notifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BaptismRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BaptismRecord_registerBookId_fkey" FOREIGN KEY ("registerBookId") REFERENCES "RegisterBook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfirmationRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "registerBookId" TEXT NOT NULL,
    "dateOfConfirmation" DATETIME NOT NULL,
    "placeOfConfirmation" TEXT NOT NULL,
    "diocese" TEXT,
    "confirmingBishop" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL,
    "confirmationSaintName" TEXT NOT NULL,
    "baptismalParish" TEXT NOT NULL,
    "baptismalBookRef" TEXT,
    "notificationSentAt" DATETIME,
    "notificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConfirmationRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConfirmationRecord_registerBookId_fkey" FOREIGN KEY ("registerBookId") REFERENCES "RegisterBook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatechismClass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "sacramentType" TEXT NOT NULL,
    "catechist" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClassMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassMember_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CatechismClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterBook_type_bookNumber_pageNumber_entryNumber_key" ON "RegisterBook"("type", "bookNumber", "pageNumber", "entryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BaptismRecord_studentId_key" ON "BaptismRecord"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "BaptismRecord_registerBookId_key" ON "BaptismRecord"("registerBookId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationRecord_studentId_key" ON "ConfirmationRecord"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationRecord_registerBookId_key" ON "ConfirmationRecord"("registerBookId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassMember_classId_studentId_key" ON "ClassMember"("classId", "studentId");
