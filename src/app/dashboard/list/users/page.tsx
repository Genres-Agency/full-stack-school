import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role?.toLowerCase();

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Username",
      accessor: "username",
      className: "hidden md:table-cell",
    },
    {
      header: "Role",
      accessor: "role",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: User) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
    >
      <td className="flex items-center gap-4 p-4 justify-center">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-center">{item.username}</td>
      <td className="hidden md:table-cell text-center">{item.role}</td>
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2 justify-center">

            <FormContainer table="users" type="update" data={item} />
            <FormContainer table="users" type="delete" id={item.id} />

          </div>
        </td>
      )}
    </tr>
  );

  const { page, perPage, ...queryParams } = await searchParams;

  const p = page ? parseInt(page) : 1;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;

  const query: Prisma.UserWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && key === "search") {
        query.OR = [
          { name: { contains: value, mode: "insensitive" } },
          { email: { contains: value, mode: "insensitive" } },
          { username: { contains: value, mode: "insensitive" } },
        ];
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.user.findMany({
      where: query,
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.user.count({ where: query }),
  ]);

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Users</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="users" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} perPage={itemsPerPage} />
    </div>
  );
};

export default UsersPage;