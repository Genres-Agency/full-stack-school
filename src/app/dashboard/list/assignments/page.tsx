import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";

type AssignmentList = Assignment & {
  subject: Subject[];
  class: Class[];
  teacher: Teacher[];
};

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // const { userId, sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Assignment Title",
      accessor: "title",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    // {
    //   header: "Class Name",
    //   accessor: "class.name",
    // },
    // {
    //   header: "Teacher Name",
    //   accessor: "teacher.name",
    //   className: "hidden md:table-cell",
    // },
    // ...(role === "admin" || role === "teacher"
    //   ? [
    //       {
    //         header: "Actions",
    //         accessor: "action",
    //       },
    //     ]
    //   : []),
  ];

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
    >
      <td className="flex items-center gap-4 p-4 justify-center">{item.title}</td>
      <td className="text-center">{item.description}</td>
      <td className="hidden md:table-cell text-center">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      {/* <td className="text-center">{item.class.map(c => c.name).join(", ")}</td>
      <td className="hidden md:table-cell text-center">
        {item.teacher.map(t => `${t.name} ${t.surname}`).join(", ")}
      </td> */}
      <td>
        <div className="flex items-center gap-2 justify-center">
          {/* {(role === "admin" || role === "teacher") && ( */}
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          {/* )} */}
        </div>
      </td>
    </tr>
  );

  const { page, perPage, ...queryParams } = await searchParams;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;
  const p = page ? parseInt(page) : 1;


  const query: Prisma.AssignmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.class = { some: { id: parseInt(value) } }; // Updated to use 'class' instead of 'classId'
            break;
          case "teacherId":
            query.teacher = { some: { id: value } }; // Updated to use 'teacher' instead of 'teacherId'
            break;
          case "search":
            query.title = { contains: value, mode: "insensitive" }; // Updated to search by assignment title
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,

      // include: {
      //   subject: {
      //     select: {
      //       name: true,
      //     },
      //   },
      //   class: {
      //     select: {
      //       name: true,
      //     },
      //   },
      //   teacher: {
      //     select: {
      //       name: true,
      //       surname: true,
      //     },
      //   },
      // },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.assignment.count({ where: query }),

  ]);

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0 ">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
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
              <FormModal table="assignment" type="create" />
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

export default AssignmentListPage;
