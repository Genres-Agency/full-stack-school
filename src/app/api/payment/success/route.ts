// Import Prisma client
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const transactionId = url.searchParams.get("tran_id");
  const status = url.searchParams.get("status");

  if (status === "VALID") {
    await prisma.onlinePayment.create({
      data: {
        transactionId: transactionId!,
        amount: 100, // You should fetch the real amount from your database
        status: "Paid",
        student: { connect: { id: "student1" } }, // You should fetch the real student ID from your database
      },
    });
    return NextResponse.redirect(`/payment/success?tran_id=${transactionId}`);
  } else {
    return NextResponse.redirect(`/payment/failed`);
  }
}
