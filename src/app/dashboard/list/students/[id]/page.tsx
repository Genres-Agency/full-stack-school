import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
// import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import { IoMail } from "react-icons/io5";
import { MdBloodtype } from "react-icons/md";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";


const SingleStudentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await getServerSession(authOptions); 
  const role = session?.user?.role?.toLowerCase();

  const student:
    | (Student & {
        class: Class & { _count: { lessons: number } };
      })
    | null = await prisma.student.findUnique({
    where: { id: (await params).id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
    },
  });

  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 ">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky dark:bg-gray-600 py-6 px-4 rounded-md  w-full col-span-2">
            <div className=" flex-1 flex gap-4">
              <div className="w-1/3">
                <Image
                  src={student.img || "/noAvatar.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="w-26 h-24 rounded-full object-cover"
                />
              </div>
              <div className="w-2/3 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold">
                      {student.name + " " + student.surname}
                    </h1>
                    {role === "admin" && (
                      <FormContainer
                        table="teacher"
                        type="update"
                        data={student}
                      />
                     )} 
                  </div>
                  <div className="text-sm text-gray-400 mt-2  ">
                    <p className="">Student ID: {student.username}</p>
                    <p>Class: {student.class.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="items-center text-xs font-medium mt-5 flex flex-col gap-2">
              <div className="w-full  flex items-center gap-2">
                <MdBloodtype className="h-[18px] w-[18px]" />
                <span>Blood: {student.bloodType}</span>
              </div>
              <div className="w-full  flex items-center gap-2">
                <HiCalendarDateRange className="h-4 w-4" />
                <span>
                  Birth Date:{" "}
                  {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                </span>
              </div>
              <div className=" w-full flex items-center gap-2">
                <IoMail className="w-4 h-4" />{" "}
                <span>Email: {student.email || "-"}</span>
              </div>
              <div className="w-full  flex items-center gap-2">
                <FaPhoneAlt className="w-4 h-4" />
                <span>Phone: {student.phone || "-"}</span>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex flex-col gap-y-2 w-full md:col-span-1 mt-4 md:mt-0">
            {/* CARD */}

            {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5"
              />

              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div> */}
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleBranch.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5"
              />

              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class.name.charAt(0)}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleLesson.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleClass.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="h-fit mt-4 bg-white dark:bg-[#18181b] rounded-md p-4">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {/* <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?classId=${student.class.id}`}
            >
              Student Lessons
            </Link> */}
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/teachers?classId=${student.class.id}`}
            >
              Student Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${student.class.id}`}
            >
              Student Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?classId=${student.class.id}`}
            >
              Student Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student.id}`}
            >
              Student Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
