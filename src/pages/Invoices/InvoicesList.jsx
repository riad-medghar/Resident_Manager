// File: src/pages/InvoicesList.jsx
import React, { useEffect } from "react";
import useInvoices from "../../hooks/useInvoices";
import { generateInvoicePdf } from "../../pdf/generateInvoicePdf";

/**
 * A purely UI-driven list of invoices.
 * All PocketBase calls come from the `useInvoices` hook.
 */
export default function InvoicesList() {
  // Destructure the hook’s state and methods
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    deleteInvoice,
    updateInvoice,
  } = useInvoices();

  // On mount, fetch all invoices
  useEffect(() => {
    fetchInvoices(); 
  }, [fetchInvoices]);

  // Mark an invoice as paid by calling updateInvoice
  async function markAsPaid(invoice) {
    try {
      await updateInvoice(invoice.id, {
        status: "paid",
        amount_paid: invoice.amount_due,
      });
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  }

  // Delete an invoice via deleteInvoice
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteInvoice(id);
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  }

  // Download PDF (optionally including partial payment data)
  async function downloadPdf(inv) {
    try {
      // If you want partial payments in the PDF,
      // you can either fetch them via a `usePayments` hook
      // or do a quick direct call here. For brevity, let's do a direct fetch:
      // (If you have a separate payments hook, use that instead.)
      
      // Example direct fetch (optional):
      // import pb from "../../pocketsdk"
      // const allPayments = await pb.collection("payments").getFullList({
      //   filter: `invoice_id = "${inv.id}"`,
      //   sort: "payment_date",
      // });
      
      const allPayments = []; // placeholder if you skip partial payments
      const pdf = await generateInvoicePdf(inv, allPayments);
      pdf.save(`invoice-${inv.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  }

  // Render the UI
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <a
        href="/invoices/create"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Create Invoice
      </a>

      {loading && <p className="mt-4 text-gray-500">Loading invoices...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

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
                  href={`/invoices/edit/${inv.id}`}
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

          {invoices.length === 0 && !loading && !error && (
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
