import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a basic invoice PDF
 * @param {object} invoice The invoice data object
 * @returns Promise<jsPDF> or jsPDF instance
 */
export async function generateInvoicePdf(invoice) {
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

  // Add notes if present
  if (invoice.notes) {
    doc.text(`Notes:`, 10, 80);
    doc.text(invoice.notes, 10, 90);
  }

  // If you want a table or items, you can use doc.autoTable(...)
  return doc;
}
