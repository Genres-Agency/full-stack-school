import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import AdmitCardButton from "@/components/AdmitCardButton";



const AdmitPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Student Name", accessor: "studentName" },
    { header: "Student ID", accessor: "studentId" },
    { header: "Class", accessor: "class" },
    { header: "Payment Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ];

  const { page, perPage } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;

const [paidStudents, count] = await prisma.$transaction([
    prisma.payment.findMany({
      where: {
        status: "Paid",
      },
      include: {
        student: {
          include: {
            class: {
              include: {
                examRoutines: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.payment.count({
      where: {
        status: "Paid",
      },
    }),
  ]);

  // console.log(paidStudents.map(student => student.student.class));
  
  

  const renderRow = (payment: any) => (
    <tr key={payment.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600">
      <td className="px-6 py-4 text-center">{payment.student.name}</td>
      <td className="px-6 py-4 text-center">{payment.student.username}</td>
      <td className="px-6 py-4 text-center">{payment.student.class.name}</td>
      <td className="px-6 py-4 text-center">
        <span className="px-2 py-1 font-semibold bg-green-100 text-green-800 rounded-full">
          {payment.status}
        </span>
      </td>
      <td className="px-6 py-4 flex items-center justify-center">
        <AdmitCardButton 
          studentId={payment.student.username} 
          studentName={payment.student.name} 
          img={payment.student.img} 
          className={payment.student.class.name} 
          parentName={payment.student.parentName} 
          dob={payment.student.birthday} 
          subjects={payment.student.class.examRoutines.map((routine: { subject: { id: number; name: string } }) => ({ id: routine.subject.id, name: routine.subject.name }))}
        />
      </td>
    </tr>
  );
  

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Admit Cards</h1>
        <TableSearch />
      </div>

      <Table 
        columns={columns} 
        data={paidStudents} 
        renderRow={renderRow} 
      />
      
      <Pagination 
        page={p} 
        count={count} 
        perPage={itemsPerPage} 
      />
    </div>
  );
};

export default AdmitPage;