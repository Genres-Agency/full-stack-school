"use client";

import Image from "next/image";
import { useState } from "react";

const paymentMethods = [
  { id: "bkash", name: "bKash", logo: "/bkash.svg" },
  { id: "Nagad", name: "Nagad", logo: "/nagad.svg" },
  { id: "Roket", name: "Roket", logo: "/roket.svg" },
];

export default function PaymentForm() {
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`/api/payment/${selectedMethod}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 my-5 dark:bg-[#18181b]">
      <h2 className="text-2xl font-semibold mb-4 text-center">Payment Details</h2>

      <div className="flex gap-3 justify-center mb-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`p-2 border rounded-md ${
              selectedMethod === method.id ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <Image src={method.logo} alt={method.name} className="h-10" />
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="amount"
          placeholder="Enter amount"
          required
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          type="text"
          name="customerName"
          placeholder="Full Name"
          required
          value={formData.customerName}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          type="email"
          name="customerEmail"
          placeholder="Email"
          required
          value={formData.customerEmail}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          type="tel"
          name="customerPhone"
          placeholder="Phone Number"
          required
          value={formData.customerPhone}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "Processing..." : `Pay with ${selectedMethod}`}
        </button>
      </form>
    </div>
  );
}
