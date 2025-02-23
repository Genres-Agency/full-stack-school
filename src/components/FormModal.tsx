"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { FormContainerProps } from "./FormContainer";
import { deleteAnnouncement } from "@/lib/announcementAction";
import { deleteSubject } from "@/lib/subjectAction";
import { deleteClass } from "@/lib/classAction";
import { deleteTeacher } from "@/lib/teacherAction";
import { deleteStudent } from "@/lib/studentAction";
import { deleteAttendance } from "@/lib/attendenceAction";
import { deleteAdmission } from "@/lib/admissionAction";
import { deleteResult } from "@/lib/resultAction";
import { deleteAssignment } from "@/lib/assignmentAction";
import { deleteFinance } from "@/lib/financeAction";
import { deletePayment } from "@/lib/paymentAction";
import ExamRoutineForm from "./forms/ExamRoutineForm";
import { deleteExamRoutine } from "@/lib/examRoutineActions";
import toast from "react-hot-toast";
import UserForm from "./forms/UserForm";
import { deleteUser } from "@/lib/userAction";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  lesson: deleteSubject,
  admission: deleteAdmission,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteSubject,
  announcement: deleteAnnouncement,
  finance: deleteFinance,
  payment: deletePayment,
  users: deleteUser,
  examRoutine: deleteExamRoutine,
};


// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AdmissionForm = dynamic(() => import("./forms/AdmissionForm"), {
  loading: () => <h1>Loading...</h1>,
});
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const FinanceForm = dynamic(() => import("./forms/FinanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const PaymentForm = dynamic(() => import("./forms/PaymentForm"), {
  loading: () => <h1>Loading...</h1>,
});
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  users: (setOpen, type, data, relatedData) => {
    return (
      <UserForm
        type={type}
        data={data}
        setOpen={setOpen}
      />
    );
  },
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm  type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  assignment: (setOpen, type, data, relatedData) => {

    console.log( "relatedData", relatedData);
    return (
      <AssignmentForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />


    );
  },
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  finance: (setOpen, type, data, relatedData) => (
    <FinanceForm type={type} data={data} setOpen={setOpen} />
  ),
  payment: (setOpen, type, data, relatedData) => (
    <PaymentForm type={type} data={data} setOpen={setOpen} />
  ),

  teacher: (setOpen, type, data, relatedData) => {
    // No need for Cloudinary configuration
    return (
      <TeacherForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={{
          subjects: relatedData?.subjects,
          classes: relatedData?.classes,
          teachers: relatedData?.teachers,
        }}
      />

    );
  },
  announcement: (setOpen, type, data, relatedData) => {
    // No need for Cloudinary configuration
    return (
      <AnnouncementForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  },
  admission: (setOpen, type, data, relatedData) => {
    // No need for Cloudinary configuration
    return (
      <AdmissionForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  },

  student: (setOpen, type, data, relatedData) => {
    // No need for Cloudinary configuration
    return (
      <StudentForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  },
  examRoutine: (setOpen, type, data, relatedData) => {
    return (
      <ExamRoutineForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    );
  },

  lesson: (setOpen, type, data, relatedData) => {
    // No need for Cloudinary configuration
    return (
      <LessonForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
        role={"" as "teacher" | "admin"} // Placeholder for role prop
      />
    );
  },

  result: (setOpen, type, data, relatedData) => (
    // <ResultForm type={type} data={data} setOpen={setOpen} />
    <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};
type TableType = keyof typeof forms;

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any; table: TableType }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.success(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-full h-full absolute left-0 top-0 bg-black bg-opacity-40 z-50 flex items-center  ">
          <div className="bg-white ml-5 dark:bg-black p-4 rounded-md relative w-[90%] md:w-[70%] overflow-x-auto overflow-y-auto max-h-[90vh]">
            <Form />

            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
