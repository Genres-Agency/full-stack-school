import { NextResponse } from "next/server";
import axios from "axios";

const BKASH_BASE_URL = "https://checkout.sandbox.bka.sh/v1.2.0-beta";
const BKASH_APP_KEY = process.env.BKASH_APP_KEY!;
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET!;
const BKASH_USERNAME = process.env.BKASH_USERNAME!;
const BKASH_PASSWORD = process.env.BKASH_PASSWORD!;
const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL + "/payment/bkash/callback";

export async function POST(req: Request) {
  const { amount, customerName, customerEmail, customerPhone } = await req.json();

  try {
    // Get Access Token
    const tokenRes = await axios.post(`${BKASH_BASE_URL}/token/grant`, {
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET,
    }, {
      auth: { username: BKASH_USERNAME, password: BKASH_PASSWORD },
    });

    const token = tokenRes.data.id_token;

    // Create Payment Request
    const paymentRes = await axios.post(`${BKASH_BASE_URL}/payment/create`, {
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: `INV-${Date.now()}`,
      callbackURL: CALLBACK_URL,
    }, {
      headers: { Authorization: token },
    });

    return NextResponse.json({ payment_url: paymentRes.data.bkashURL });
  } catch (error) {
    return NextResponse.json({ error: "bKash payment failed" }, { status: 500 });
  }
}
