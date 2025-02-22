import prisma from "@/lib/prisma";
import SingleStudentPage from "../list/students/[id]/page";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth"
// import BigCalendarContainer from "@/components/BigCalendarContainer";
// import Announcements from "@/components/Announcements";

const StudentPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: user?.username! } },
    },
  });

  const student = await prisma.student.findUnique({
    where: {
      id: user?.username!,
    },
  });

  // console.log(student, "student", user?.username);

  // console.log(classItem);


  return (
      <div className="w-full ">
      <SingleStudentPage params={Promise.resolve({id: student?.id || ''})}/> 

      </div>
  );
};

export default StudentPage;
