import jsPDF from "jspdf";
import "jspdf-autotable";


export async function generateReceiptPdf(receipt) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = margin;

  // HEADER
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(76, 175, 80); // soft green
  doc.text("Payment Receipt", margin, currentY);
  currentY += 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0); // black

  // Receipt Details
  const details = [
    `Payment ID: ${receipt.id}`,
    `Invoice ID: ${receipt.invoice_id}`,
    `Amount: ${formatCurrency(receipt.amount)}`,
    `Payment Date: ${new Date(receipt.payment_date).toLocaleString()}`,
    `Payment Method: ${receipt.payment_method}`,
    `Reference #: ${receipt.reference_number}`,
    `Resident ID: ${receipt.resident_id}`,
    `Notes: ${receipt.notes}`
  ];

  details.forEach((line) => {
    currentY += 10;
    doc.text(line, margin, currentY);
  });

  // FOOTER
  doc.setLineWidth(0.5);
  doc.setDrawColor(76, 175, 80);
  doc.line(margin, currentY + 15, pageWidth - margin, currentY + 15);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for your payment!", pageWidth / 2, currentY + 25, { align: "center" });

  return doc;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}