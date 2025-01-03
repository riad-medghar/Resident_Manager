// src/pdf/generateInvoicePdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a basic invoice PDF
 * @param {object} invoice The invoice data object
 * @param {object[]} payments An optional array of partial payments for this invoice
 */
export async function generateInvoicePdf(invoice, payments = []) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Invoice #${invoice.id}`, 10, 10);

  doc.setFontSize(12);
  doc.text(`Allocation: ${invoice.allocation_id || "N/A"}`, 10, 20);
  doc.text(`Billing Period: ${invoice.billing_period || "N/A"}`, 10, 30);
  doc.text(`Due Date: ${invoice.due_date || "N/A"}`, 10, 40);

  doc.text(`Amount Due: $${invoice.amount_due || 0}`, 10, 50);
  doc.text(`Amount Paid: $${invoice.amount_paid || 0}`, 10, 60);
  doc.text(`Status: ${invoice.status}`, 10, 70);

  // If you want to include partial payments in a table:
  if (payments.length > 0) {
    doc.text(`Payments:`, 10, 80);

    // Using autoTable for a small table
    const rows = payments.map((p) => [
      p.payment_date,
      `$${p.amount}`,
      p.status,
      p.payment_method,
    ]);

    doc.autoTable({
      startY: 85,
      head: [["Payment Date", "Amount", "Status", "Method"]],
      body: rows,
      theme: "striped",
    });
  }

  // Add notes if present
  let nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 90;
  if (invoice.notes) {
    doc.text(`Notes: ${invoice.notes}`, 10, nextY);
  }

  return doc;
}
