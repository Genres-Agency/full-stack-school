import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
// import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "examRoutine"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "admission"
    | "finance"
    | "payment";  
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;
  // const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: announcementClasses };
        break;
      case "admission":
        const admissionGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        relatedData = { grades: admissionGrades };
        break;
      case "payment":
        const paymentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { students: paymentStudents };
        break;  
      case "assignment":
        const assignmentSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const assignmentClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const assignmentTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          subjects: assignmentSubjects,
          classes: assignmentClasses,
          teachers: assignmentTeachers,
        };
        break;

      

      case "attendance":
        const attendanceClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: attendanceClasses };
        break;
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { teachers: subjectTeachers };
        break;
      case "lesson":
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
        };
        break;
      case "class":
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers};
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
    
      case "examRoutine":
        const examRoutineClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const examRoutineSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: examRoutineClasses, subjects: examRoutineSubjects };
        break;
      case "result":
        const resultSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = { subjects: resultSubjects };
        break;

      default:
        break;
    }
  }

  return (
    <div className="h-fit">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
