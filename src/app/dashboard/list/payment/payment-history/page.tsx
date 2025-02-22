import { Payment, Prisma } from "@prisma/client";
import FormModal from "@/components/FormModal";
import DownloadPaymentPDF from "@/components/forms/PaymentPdfDownload"; // Import the component
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
// import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

export type PaymentHistory = Payment;

const PaymentHistoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  // const { userId, sessionClaims } = await auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;
  // const currentUserId = userId;

  // Define columns for the table
  const columns = [
    {
      header: "Student Name",
      accessor: "studentName",
    },
    {
      header: "Student ID",
      accessor: "studentId",
    },
    {
      header: "Amount",
      accessor: "amount",
    },
    {
      header: "Payment Date",
      accessor: "paymentDate",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
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

  // Define renderRow function to render each payment row
  const renderRow = (item: PaymentHistory & { student: { name: string; surname: string; }; className: string }) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600">
      <td className="flex items-center p-4 justify-center">{item.student.name} {item.student.surname}</td>
      <td className="text-center">{item.studentId}</td>
      <td className="hidden md:table-cell gap-4 text-center">TK {item.amount}</td>
      <td className="hidden md:table-cell gap-4 text-center">{new Intl.DateTimeFormat("en-CA").format(new Date(item.createdAt))}</td>
      <td className={`text-center font-semibold ${item ? (item.status === "Paid" ? "text-green-500 " : "text-orange-500") : "text-red-500"}`}>{item.status}</td>
      <td>
        <div className="flex items-center gap-2 justify-center">
          {/* {role === "admin" && ( */}
            <>
              <FormModal table="payment" type="update" data={item} />
              <FormModal table="payment" type="delete" id={item.id} />
            </>
          {/* )} */}
          {/* Pass student name and class name */}
         
          
          <DownloadPaymentPDF   {...item}  />
        </div>
      </td>
    </tr>
  );
  
  

  // Handle pagination and search parameters
  const { page, perPage } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;

  const query: Prisma.PaymentWhereInput = {};

  const [payments, count] = await prisma.$transaction([
    prisma.payment.findMany({
      where: query,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.payment.count({ where: query }),
  ]);

  // Check if payments is null or undefined
  if (!payments) {
    return (
      <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
        <h1 className="text-lg font-semibold">No payments found.</h1>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Payment History</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          {/* <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormModal table="payment" type="create" />
            )}
          </div> */}
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={payments} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} perPage={itemsPerPage} />
    </div>
  );
};

export default PaymentHistoryPage;
