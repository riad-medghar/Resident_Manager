// src/utils/recordPayment.js
import pb from "../pocketsdk";

/**
 * Record a payment and automatically update the invoice's amount_paid and status.
 * @param {string} invoiceId The invoice's ID
 * @param {string} residentId The resident's ID
 * @param {number} paymentAmount The payment made
 * @param {string} paymentMethod e.g. 'cash', 'bank', ...
 */
export async function recordPayment(invoiceId, residentId, paymentAmount, paymentMethod = "cash") {
  // 1) Create the payment
  const newPayment = await pb.collection("payments").create({
    invoice_id: invoiceId,
    resident_id: residentId,
    payment_date: new Date().toISOString().split("T")[0], // or a date/time input
    amount: paymentAmount,
    payment_method: paymentMethod,
    status: "completed",
  });

  // 2) Sum all payments for that invoice
  const allPayments = await pb.collection("payments").getFullList({
    filter: `invoice_id = "${invoiceId}"`,
  });
  const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  // 3) Fetch the invoice
  const invoice = await pb.collection("invoices").getOne(invoiceId);
  const due = Number(invoice.amount_due) || 0;

  // 4) Decide new status
  let newStatus = "unpaid";
  if (totalPaid >= due) {
    newStatus = "paid"; // if sum > due, we consider it fully paid
  } else if (totalPaid > 0 && totalPaid < due) {
    newStatus = "partial";
  }

  // If the due_date is in the past but totalPaid < due, mark it overdue
  const now = new Date();
  if (newStatus !== "paid" && invoice.due_date) {
    const dueDateObj = new Date(invoice.due_date);
    if (now > dueDateObj) {
      newStatus = "overdue";
    }
  }

  // 5) Update the invoice
  await pb.collection("invoices").update(invoiceId, {
    amount_paid: totalPaid > due ? due : totalPaid, // cap at amount_due if overpayment
    status: newStatus,
  });

  return newPayment; // if needed
}
