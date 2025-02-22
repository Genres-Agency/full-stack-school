import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Prisma } from "@prisma/client";
// import { auth } from "@clerk/nextjs/server";

type AttendanceWithClass = Attendance & {
  classes: { id: number; name: string };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // const { sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Class Name",
      accessor: "class.name",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Day",
      accessor: "day",
      className: "hidden md:table-cell",
    },
    {
      header: "Present Students",
      accessor: "present",
    },
    {
      header: "Total Students",
      accessor: "total",
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
  

  const renderRow = (item: AttendanceWithClass) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
    >
      <td className="flex items-center justify-center gap-4 p-4">
        {item.classes.name}
      </td>
      <td className="hidden md:table-cell text-center">
        {item.date.toISOString().split("T")[0]}
      </td>
      <td className="hidden md:table-cell text-center">{item.day}</td>
      <td className="text-center">{item.present}</td>
      <td className="text-center">{item.total}</td>
      <td>
        <div className="flex items-center gap-2 justify-center">
          {/* {(role === "admin" || role === "teacher") && ( */}
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          {/* )} */}
        </div>
      </td>
    </tr>
  );

  const { page, perPage, ...queryParams } = await searchParams;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams?.classId) {
    query.classId = parseInt(queryParams?.classId);
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          },
        }
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.attendance.count({
      where: query,
    }),
  ]);


  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Attendance Records
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* {(role === "admin" || role === "teacher") && ( */}
              <FormContainer table="attendance" type="create" />
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

export default AttendanceListPage;
