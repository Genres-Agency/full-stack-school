import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { MdBloodtype } from "react-icons/md";
import { HiCalendarDateRange } from "react-icons/hi2";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

const SingleTeacherPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

  const session = await getServerSession(authOptions); 
  const role = session?.user?.role?.toLowerCase();

  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id: (await params).id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
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

                  src={teacher.img || "/noAvatar.png"}
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
                      {teacher.name + " " + teacher.surname}
                    </h1>
                    {role === "admin" && (
                      <FormContainer
                        table="teacher"
                        type="update"
                        data={teacher}
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>
            </div>
            <div className="items-center text-xs font-medium mt-5 flex flex-col gap-2">
              <div className="w-full  flex items-center gap-2">
                <MdBloodtype className="h-[18px] w-[18px]" />
                <span>Blood: {teacher.bloodType}</span>
              </div>
              <div className="w-full  flex items-center gap-2">
                <HiCalendarDateRange className="h-4 w-4" />
                <span>
                  Joined Date:{" "}
                  {teacher?.joiningDate
                    ? new Intl.DateTimeFormat("en-GB").format(
                        teacher.joiningDate
                      )
                    : "-"}
                </span>
              </div>
              <div className=" w-full flex items-center gap-2">
                
                  <IoMail className="w-4 h-4" /> <span>Email: {teacher.email || "-"}</span>
             
              </div>
              <div className="w-full  flex items-center gap-2">
                <FaPhoneAlt className="w-4 h-4" />
                <span>Phone: {teacher.phone || "-"}</span>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex flex-col gap-y-2 w-full md:col-span-1 mt-4 md:mt-0">
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex gap-4 w-full ">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white dark:bg-[#18181b] rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/classes?supervisorId=${teacher.id}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/students?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/lessons?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
