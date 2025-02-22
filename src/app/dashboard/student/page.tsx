import prisma from "@/lib/prisma";
// import { auth, currentUser } from "@clerk/nextjs/server";
import SingleStudentPage from "../list/students/[id]/page";

const StudentPage = async () => {
  // const { userId } = await auth();
  // const user = await currentUser();

  // const classItem = await prisma.class.findMany({
  //   where: {
  //     students: { some: { id: userId! } },
  //   },
  // });

  // const student = await prisma.student.findUnique({
  //   where: {
  //     id: user?.username!,
  //   },
  // });

  // console.log(student, "student", user?.username);

  // console.log(classItem);


  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row w-full">
      {/* LEFT */}
      <div className="w-full ">
      {/* <SingleStudentPage params={Promise.resolve({id: student?.id || ''})}/> */}



        {/* <div className=" bg-white dark:bg-[#18181b] p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={classItem[0]?.id} />
        </div> */}
      </div>
      {/* RIGHT */}
      {/* <div className="w-full xl:w-1/3">
      <Announcements />
        <EventCalendar />
        
      </div> */}
    </div>
  );
};

export default StudentPage;
