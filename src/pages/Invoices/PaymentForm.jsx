// src/pages/PaymentForm.jsx
import React, { useState } from "react";
import { recordPayment } from "../utils/recordPayment";
import { useNavigate } from "react-router-dom";

export default function PaymentForm({ invoiceId, residentId }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("cash");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await recordPayment(invoiceId, residentId, parseFloat(amount), method);
      alert("Payment recorded!");
      navigate(`/invoices`); // or a hash route
    } catch (err) {
      console.error("Error recording payment:", err);
      alert("Payment failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Add Payment</h2>
      <div>
        <label className="block mb-1">Amount</label>
        <input
          type="number"
          className="border rounded w-full p-2"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Method</label>
        <select
          className="border rounded w-full p-2"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="bank">Bank Transfer</option>
          <option value="card">Card</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Payment
      </button>
    </form>
  );
}
