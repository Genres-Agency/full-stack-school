import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Finance, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

type FinanceList = Finance & {
  // Add any related fields if necessary
};

const FinanceListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await getServerSession(authOptions); 
  const role = session?.user?.role?.toLowerCase();

  const columns = [
    {
      header: "Type",
      accessor: "type",
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Date",
      accessor: "date",
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

  const renderRow = (item: FinanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600"
    >
      <td className={`flex items-center gap-4 p-4 justify-center uppercase font-semibold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{item.type}</td>
      <td className="text-center">{item.amount}</td>
      <td className="text-center">{item.description}</td>
      <td className="hidden md:table-cell text-center">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td>
        <div className="flex items-center gap-2 justify-center">
          {role === "admin" && (
            <>
              <FormContainer table="finance" type="update" data={item} />
              <FormContainer table="finance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, perPage, ...queryParams } = await searchParams;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;
  const p = page ? parseInt(page) : 1;


  const query: Prisma.FinanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // Add any specific filters if needed
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.finance.findMany({
      where: query,
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.finance.count({ where: query }),

  ]);

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Finance Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && 
            <FormContainer table="finance" type="create" />
            }
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

export default FinanceListPage;
