import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const transactionId = url.searchParams.get("paymentID");

  if (status === "success") {
    return NextResponse.redirect(`/payment/success?transaction_id=${transactionId}`);
  } else {
    return NextResponse.redirect(`/payment/failed`);
  }
}
