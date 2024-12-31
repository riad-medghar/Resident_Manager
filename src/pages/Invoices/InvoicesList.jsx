import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase"; // or: import pb from "../pocketsdk"
import { generateInvoicePdf } from "../../pdf/generateInvoicePdf";

// If you have a pocketsdk file:
const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, []);

  async function fetchInvoices() {
    try {
      const records = await pb.collection("invoices").getFullList({
        sort: "-created",
      });
      setInvoices(records);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await pb.collection("invoices").delete(id);
      fetchInvoices(); // refresh
    } catch (err) {
      console.error("Error deleting:", err);
    }
  }

  async function markAsPaid(invoice) {
    try {
      // If your "invoices" collection has fields "amount_due" & "amount_paid"
      await pb.collection("invoices").update(invoice.id, {
        status: "paid",
        amount_paid: invoice.amount_due,
      });
      fetchInvoices();
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  }

  async function downloadPdf(inv) {
    try {
      // Optionally fetch any related items or partial payments, if you want them in the PDF
      // const items = await pb.collection("invoiceItems").getFullList({ filter: `invoice="${inv.id}"` });

      const pdf = await generateInvoicePdf(inv);
      pdf.save(`invoice-${inv.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <a
        href="#/create-invoice" // or a React Router <Link to="/invoices/create">
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Create Invoice
      </a>
      <table className="min-w-full mt-4">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Amount Due</th>
            <th className="py-2 px-4 text-left">Amount Paid</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Due Date</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b">
              <td className="py-2 px-4">{inv.id}</td>
              <td className="py-2 px-4">${inv.amount_due}</td>
              <td className="py-2 px-4">${inv.amount_paid || 0}</td>
              <td className="py-2 px-4 capitalize">{inv.status}</td>
              <td className="py-2 px-4">{inv.due_date || ""}</td>
              <td className="py-2 px-4 space-x-2">
                <a
                  href={`#/edit-invoice/${inv.id}`} // or <Link>
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </a>
                <button
                  onClick={() => downloadPdf(inv)}
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                >
                  Download
                </button>
                {inv.status !== "paid" && (
                  <button
                    onClick={() => markAsPaid(inv)}
                    className="bg-orange-500 text-white px-2 py-1 rounded"
                  >
                    Mark Paid
                  </button>
                )}
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan="6" className="py-4 text-center">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
