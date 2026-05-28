"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import StudentForm from "@/components/StudentForm";
import { fullName } from "@/lib/utils";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<{ firstName: string; middleName?: string; lastName: string; [key: string]: unknown } | null>(null);

  useEffect(() => {
    fetch(`/api/students/${id}`).then((r) => r.json()).then((data) => {
      setStudent({
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
      });
    });
  }, [id]);

  if (!student) return <div className="flex-1 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  return (
    <div className="flex-1 flex flex-col">
      <Header title={`Edit: ${fullName(student as { firstName: string; middleName?: string; lastName: string })}`} subtitle="Update student information" />
      <div className="p-4 sm:p-8">
        <StudentForm
          initial={student as Record<string, string>}
          studentId={id}
          onSuccess={() => router.push(`/students/${id}`)}
        />
      </div>
    </div>
  );
}
