// src/pages/InvoiceForm.jsx
import React, { useEffect, useState } from "react";
import pb from "../../pocketsdk";
import { useParams, useNavigate } from "react-router-dom"; 
// or a custom hook that reads the hash if not using React Router

export default function InvoiceForm() {
  const { invoiceId } = useParams(); // e.g. /invoices/create or /invoices/edit/:invoiceId
  const navigate = useNavigate();

  const isEdit = !!invoiceId;
  const [form, setForm] = useState({
    allocation_id: "",
    billing_period: "",
    amount_due: 0,
    amount_paid: 0,
    status: "unpaid",
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    if (isEdit) {
      loadInvoice(invoiceId);
    }
  }, [isEdit, invoiceId]);

  async function loadInvoice(id) {
    try {
      const inv = await pb.collection("invoices").getOne(id);
      setForm({
        allocation_id: inv.allocation_id || "",
        billing_period: inv.billing_period || "",
        amount_due: inv.amount_due || 0,
        amount_paid: inv.amount_paid || 0,
        status: inv.status || "unpaid",
        due_date: inv.due_date || "",
        notes: inv.notes || "",
      });
    } catch (err) {
      console.error("Error loading invoice:", err);
      alert("Failed to load invoice");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isEdit) {
        await pb.collection("invoices").update(invoiceId, form);
        alert("Invoice updated!");
      } else {
        await pb.collection("invoices").create(form);
        alert("Invoice created!");
      }
      navigate("/invoices"); // or window.location.hash = "#/invoices"
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Failed to save invoice");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Invoice" : "Create Invoice"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium mb-1">Allocation ID</label>
          <input
            className="border rounded w-full p-2"
            name="allocation_id"
            value={form.allocation_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Billing Period</label>
          <input
            className="border rounded w-full p-2"
            type="date"
            name="billing_period"
            value={form.billing_period}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Amount Due</label>
          <input
            className="border rounded w-full p-2"
            type="number"
            step="0.01"
            name="amount_due"
            value={form.amount_due}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Amount Paid</label>
          <input
            className="border rounded w-full p-2"
            type="number"
            step="0.01"
            name="amount_paid"
            value={form.amount_paid}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            className="border rounded w-full p-2"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="unpaid">unpaid</option>
            <option value="partial">partial</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Due Date</label>
          <input
            className="border rounded w-full p-2"
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Notes</label>
          <textarea
            className="border rounded w-full p-2"
            rows={3}
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
