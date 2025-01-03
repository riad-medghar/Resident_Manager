import React, { useEffect } from "react";
import { Plus, Download, Edit2, Trash2, Check } from "lucide-react";
import useInvoices from "../../hooks/useInvoices";
import { generateInvoicePdf } from "../../pdf/generateInvoicePdf";

export default function InvoicesList() {
  const {
    invoices,
    loading,
    error,
    fetchInvoices,
    deleteInvoice,
    updateInvoice,
  } = useInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteInvoice(id);
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  }

  async function downloadPdf(inv) {
    try {
      const allPayments = [];
      const pdf = await generateInvoicePdf(inv, allPayments);
      pdf.save(`invoice-${inv.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 flex flex-row items-center justify-between border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <a
          href="/invoices/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Create Invoice
        </a>
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        <div className="grid gap-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Invoice</span>
                    <span className="font-medium">#{inv.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Amount Due</p>
                      <p className="font-semibold">${inv.amount_due}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="font-semibold">${inv.amount_paid || 0}</p>
                    </div>
                    {inv.due_date && (
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-semibold">{inv.due_date}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPdf(inv)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={14} />
                    PDF
                  </button>
                  <a
                    href={`/invoices/edit/${inv.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </a>
                  {inv.status !== "paid" && (
                    <button
                      onClick={() => markAsPaid(inv)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <Check size={14} />
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-600 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {invoices.length === 0 && !loading && !error && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No invoices found.</p>
              <a
                href="/invoices/create"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create your first invoice
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}