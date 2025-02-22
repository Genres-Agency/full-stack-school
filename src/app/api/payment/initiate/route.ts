import { NextResponse } from "next/server";
import axios from "axios";

const SSL_API_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"; // Use live URL in production
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID!;
const STORE_PASSWD = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const SITE_URL = process.env.NEXT_PUBLIC_URL!; // e.g., http://localhost:3000 or live site URL

export async function POST(req: Request) {
  try {
    const { amount, customerName, customerEmail, customerPhone } = await req.json();

    const payload = {
      store_id: STORE_ID,
      store_passwd: STORE_PASSWD,
      total_amount: amount,
      currency: "BDT",
      tran_id: `txn_${Date.now()}`, // Unique transaction ID
      success_url: `${SITE_URL}/api/payment/success`,
      fail_url: `${SITE_URL}/api/payment/fail`,
      cancel_url: `${SITE_URL}/api/payment/cancel`,
      ipn_url: `${SITE_URL}/api/payment/ipn`,
      cus_name: customerName,
      cus_email: customerEmail,
      cus_phone: customerPhone,
      product_name: "School Management System",
      product_category: "Digital Service",
      product_profile: "general",
    };

    const response = await axios.post(SSL_API_URL, payload);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
