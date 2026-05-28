import Header from "@/components/Header";
import StudentForm from "@/components/StudentForm";

export default function NewStudentPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Add New Student" subtitle="Create a new student record" />
      <div className="p-4 sm:p-8">
        <StudentForm />
      </div>
    </div>
  );
}
