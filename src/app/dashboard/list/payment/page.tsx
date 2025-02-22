import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import ClientPaymentList from "@/components/ClientPaymentList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

const Payments = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await getServerSession(authOptions); 
  const role = session?.user?.role?.toLowerCase();

  const { page, perPage } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const itemsPerPage = perPage ? parseInt(perPage) : ITEM_PER_PAGE;

  const [students, count] = await prisma.$transaction([
    prisma.student.findMany({
      include: {
        class: { select: { fees: true } },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (p - 1),
    }),
    prisma.student.count(),
  ]);
  const payments = await prisma.payment.findMany({
    where: {
      studentId: {
        in: students.map(student => student.username),
      },
    },
  });
  // console.log(payments);

  

  return (
    <ClientPaymentList
      payments={payments}
      students={students}
      total={count}
      role={role}
      page={p}
      perPage={itemsPerPage}
    />
  );
};

export default Payments;
