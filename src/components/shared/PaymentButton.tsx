"use client";

import { useState } from "react";

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const response = await fetch("/api/payment/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 100, // Example amount
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "017XXXXXXXX",
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.GatewayPageURL) {
      window.location.href = data.GatewayPageURL; // Redirect to payment page
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-sky-600 text-white rounded-md"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
