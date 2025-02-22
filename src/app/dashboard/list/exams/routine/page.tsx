import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { ExamRoutine, Prisma } from "@prisma/client";
import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";

type ExamRoutineList = ExamRoutine & {
  classes: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
};

const ExamRoutinePage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  // const { userId, sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Exam Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class.name",
    },
    {
      header: "Subject",
      accessor: "subject.name",
    },
    {
      header: "Subject Code",
      accessor: "subject.id",
    },
    {
      header: "Exam Date",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "Time",
      accessor: "time",
      className: "hidden md:table-cell",
    },
    // ...(role === "admin"
    //   ? [
          {
            header: "Actions",
            accessor: "action",
          },
      //   ]
      // : []),
  ];

  const renderRow = (item: ExamRoutineList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
    >
      <td className="flex items-center gap-4 p-4 justify-center">{item.title}</td>
      <td className="text-center">{item.classes.name}</td>
      <td className="text-center">{item.subject.name}</td>
      <td className="text-center">{item.subject.id}</td>
      <td className="hidden md:table-cell text-center">
        {new Intl.DateTimeFormat("en-US", { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.startTime))}
      </td>
      <td className="hidden md:table-cell text-center">
      {new Intl.DateTimeFormat("en-US", {  timeStyle: "short" }).format(new Date(item.startTime))}
      </td>
      {/* {role === "admin" && ( */}
        <td>
          <div className="flex items-center gap-2 justify-center">
            <FormContainer table="examRoutine" type="update" data={item} />
            <FormContainer table="examRoutine" type="delete" id={item.id} />
          </div>
        </td>
      {/* )} */}
    </tr>
  );

  const { page, perPage, ...queryParams } = await searchParams;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExamRoutineWhereInput = {};

  if (queryParams?.classId) {
    query.classId = parseInt(queryParams?.classId);
  }

  const [data, count] = await prisma.$transaction([
    prisma.examRoutine.findMany({
      where: query,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.examRoutine.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exam Routines</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {/* {role === "admin" &&  */}
            <FormContainer table="examRoutine" type="create" />
            {/* } */}
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

export default ExamRoutinePage;
