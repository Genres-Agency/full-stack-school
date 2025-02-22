"use client";
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import { PaymentHistory } from "@/app/dashboard/list/payment/payment-history/page";


const DownloadPaymentPDF: React.FC<PaymentHistory & { student: { name: string; surname: string }}> = (data) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Money Receipt", 20, 10);
    doc.autoTable({
      head: [["Label", "Value"]],
      body: [
        ["Student Name", `${data.student.name} ${data.student.surname}`], 
        ["Student ID", data.studentId],
        ["Amount", `${data.amount}/=`],
        ["Payment Date", data.createdAt.toISOString().split("T")[0]],
        ["Status", data.status],
        ["Signature", "________________________________"]
      ],

    });
    doc.save(`payment_${data.id}.pdf`);
  };

  return (
    <button
      onClick={downloadPDF}
      className="bg-blue-300 text-white p-1 rounded-md flex items-center gap-2 px-2"
    >
      <FaDownload className="w-3 h-3" /> Invoice
    </button>
  );
};

export default DownloadPaymentPDF;
