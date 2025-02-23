"use client";

import React, { useState } from "react";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import PaymentForm from "@/components/forms/PaymentForm";



type StudentWithPayments = {
  id: string; // Ensure this matches Prisma's return type
  name: string;
  username: string;
  class: { fees: number };
  payments: {
    id: string; // Ensure payment ID is also a string
    amount: number;
    status: string;
  }[];
};

type Payment = {
  id: string;
  amount: number;
  studentId: string;
};

const ClientPaymentList = ({ students, total, role, page, perPage, payments}: { students: StudentWithPayments[]; total: number; role?: string; page: number; perPage: number, payments: Payment[] }) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  // console.log("fadfsadfas====",selectedStudentId);
  

  const handleOpenForm = (studentId: string) => {
    setSelectedStudentId(studentId);
    setOpenForm(true);
  };

  const columns = [
    { header: "Student Name", accessor: "name" },
    { header: "Student ID", accessor: "username" },
    { header: "Fees", accessor: "fees" },
    { header: "Due Fees", accessor: "due" },
    { header: "Paid Fees", accessor: "paid" },
    { header: "Status", accessor: "status" },
    { header: "Action", accessor: "Action" },

  ];

  const renderRow = (student: StudentWithPayments) => {
    const payment = student.payments[0];
    const classes = student.class;
    const totalPaid = payments
      .filter(payment => payment.studentId === student.username)
      .reduce((sum, payment) => sum + payment.amount, 0);
    console.log(totalPaid);
    const due = classes ? Math.max(classes.fees - totalPaid, 0) : 0;
    


    return (
      <tr key={student.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight dark:bg-[#18181b] dark:hover:bg-gray-500 dark:even:bg-gray-600">
        <td className="flex items-center gap-4 p-4 justify-center">{student.name}</td>
        <td className="text-center ">{student.username}</td>
        <td className="text-center">{classes ? classes.fees : 0}</td>
        <td className="text-center">{due > 0 ? due : 0}</td>
        <td className="text-center">{totalPaid}</td>
        <td className={`text-center `}>
          <span className={`text-center font-semibold py-1 px-2 rounded-full ${payment ? (payment.status === "Paid" ? "text-green-800 bg-green-100" : payment.status === "Not Paid" ? "text-red-500 bg-red-100"  : "text-orange-500 bg-orange-100") : "text-red-600 bg-red-100"}`}>
          {payment ? payment.status : "Not Paid"}
          </span>
        </td>


        <td className="flex justify-center">
          <button
            onClick={() => handleOpenForm(student.username)}
            className="bg-sky-500 text-white px-4 py-1 rounded-md"
          >
            Pay
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white dark:bg-[#18181b] p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Payments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={students} />
      <Pagination page={page} count={total} perPage={perPage} />

      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-black p-4 rounded-md shadow-lg">
            <PaymentForm type="create" data={{ studentId: selectedStudentId || "", amount: 0, status: "NotPaid" }} setOpen={setOpenForm} />
          </div>
        </div>
      )}
    </div>
  );
};


export default ClientPaymentList;
