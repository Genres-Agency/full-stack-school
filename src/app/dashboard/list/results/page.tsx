import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";

// import { auth } from "@clerk/nextjs/server";

type ResultList = {
  id: number;
  studentId: string;
  studentName: string;
  studentSurname: string;
  subjectId: string;
  subjectName: string;
  marks: number;
};


const ResultListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {

// const { userId, sessionClaims } = await auth();
// const role = (sessionClaims?.metadata as { role?: string })?.role;
// const currentUserId = userId;


const columns = [
  {
    header: "Student ID",
    accessor: "studentId",
  },
  {
    header: "Student Name",
    accessor: "studentName",
  },
  {
    header: "Subject ID",
    accessor: "subjectId",
  },
  {
    header: "Subject",
    accessor: "subjectName",
  },
  {
    header: "Marks",
    accessor: "marks",
  },

  // ...(role === "admin" || role === "teacher"
  //   ? [
        {
          header: "Actions",
          accessor: "action",
        },
    //   ]
    // : []),
];

const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
  >
    <td className="flex items-center gap-4 p-4 justify-center">{item.studentId}</td>
    <td className=" text-center">{item.studentName + " " + item.studentSurname}</td>
    <td className="flex items-center gap-4 p-4 justify-center">{item.subjectId}</td>
    <td className=" text-center">{item.subjectName}</td>
    <td className="flex items-center gap-4 p-4 justify-center">{item.marks}</td>

 
    <td>
      <div className="flex items-center gap-2 justify-center">

        {/* {(role === "admin" || role === "teacher") && ( */}
          <>
            <FormContainer table="result" type="update" data={item} />
            <FormContainer table="result" type="delete" id={item.id} />
          </>
        {/* )} */}
      </div>
    </td>
  </tr>
);

  const { page, perPage, ...queryParams } = await searchParams; 
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;

  const p = page ? parseInt(page) : 1;


  // URL PARAMS CONDITION 

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { student: { username: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:

            break;
        }
      }
    }
  }



  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { id: true, name: true, surname: true , username: true} },
        subject: { select: { id: true, name: true } },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.result.count({ where: query }),

  ]);

  const data = dataRes.map((item) => ({
    id: item.id,
    studentId: item.student?.username,
    studentName: item.student?.name,
    studentSurname: item.student?.surname,
    subjectId: item.subject?.id,
    subjectName: item.subject?.name,
    marks: item.marks, // Correct key
  }));
  


  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* {(role === "admin" || role === "teacher") && ( */}
              <FormContainer table="result" type="create" />
            {/* )} */}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} perPage={itemsPerPage} />
    </div>
  );
};

export default ResultListPage;
