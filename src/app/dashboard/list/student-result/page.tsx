import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
// import { auth, currentUser } from "@clerk/nextjs/server";

type ResultList = {
  id: number;
  subjectId: string;
  surename: string;
  subjectName: string;
  marks: number;
  grade: string;
};

const StudentResultPage = async () => {
  // const { userId, sessionClaims } = await auth();
  // const user = await currentUser();
  // console.log("userId 0000=====",userId, "sessionClaims====", sessionClaims, "user====", user);
  // const role = (sessionClaims?.metadata as { role?: string })?.role;


  // Ensure only students can access this page
  // if (role !== "student") {
  //   return <p className="text-red-500 text-center">Unauthorized access</p>;
  // }

  // Fetch results for the logged-in student
  const dataRes = await prisma.result.findMany({
    // where: { studentId: user?.username! },
    include: {
      student: { select: { name: true, surname: true , username: true} },
      subject: { select: { id: true, name: true } },
    },
  });



  const data = dataRes.map((item) => ({
    id: item.id,
    studentId: item.student?.username,
    studentName: item.student?.name,
    studentSurname: item.student?.surname,
    subjectId: item.subject?.id,
    subjectName: item.subject?.name,
    marks: item.marks,
    grade: item.grade,
  }));

  const columns = [
    { header: "Subject ID", accessor: "subjectId" },
    { header: "Subject", accessor: "subjectName" },
    { header: "Marks", accessor: "marks" },
    { header: "Points", accessor: "points" },
    { header: "Grade", accessor: "grade" },
  ];


  const totalMarks = data.reduce((sum, item) => sum + (item.marks || 0), 0); 
  const totalSubjects = data.length;
  const totalPoints = totalMarks / totalSubjects >= 80 ? 5 + ".00" : totalMarks / totalSubjects >= 70 ? 4 + ".00" : totalMarks / totalSubjects >= 60 ? 3.5 + ".0" : totalMarks / totalSubjects >= 50 ? 3 + ".00" : totalMarks / totalSubjects >= 40 ? 2 + ".00" : totalMarks / totalSubjects >= 33 ? 1 + ".00" : "F"
  const totalGrade = totalMarks / totalSubjects >= 5 ? "A+" : totalMarks / totalSubjects >= 4 ? "A" : totalMarks / totalSubjects >= 3.5 ? "A-"  : totalMarks / totalSubjects >= 3 ? "B"  : totalMarks / totalSubjects >= 2 ? "C" : totalMarks / totalSubjects >= 1 ? "D" : "F"



  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold text-center">Your Results</h1>

      <Table columns={columns} data={data} renderRow={(item: ResultList) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600">
          <td className="p-4 text-center">{item.subjectId}</td>
          <td className="text-center">{item.subjectName}</td>
          <td className="p-4 text-center">{item.marks}</td>
          <td className="p-4 text-center">
            {item.marks >= 80 ? 5 : item.marks >= 70 ? 4 : item.marks >= 60 ? 3.5 : item.marks >= 50 ? 3 : item.marks >= 40 ? 2 : item.marks >= 33 ? 1 : "F"}
          </td>
          <td className="p-4 text-center">{item.grade}</td>
        </tr>
      )}/>
      <div className="flex items-center justify-between mt-5 px-5">
        <h1 className="text-lg font-semibold">Total Marks: {totalMarks}</h1>
        <h1 className="text-lg font-semibold">Average Marks: {totalMarks / totalSubjects}</h1>
        <h1 className="text-lg font-semibold">Average Points: {totalPoints}</h1>
        <h1 className="text-lg font-semibold">Grade: {totalGrade}</h1>
      </div>
    </div>

  );
};

export default StudentResultPage;
