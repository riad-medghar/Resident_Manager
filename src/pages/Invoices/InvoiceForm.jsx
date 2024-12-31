import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";

// If you have a shared pocketsdk file, import that instead:
// import pb from "../pocketsdk";

const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

/**
 * Unified Invoice Form
 * - Create mode if `invoiceId` is NOT provided
 * - Edit mode if `invoiceId` is provided
 */
export default function InvoiceForm({ invoiceId, onSaved }) {
  // Main form fields
  const [form, setForm] = useState({
    invoiceNo: "",
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    invoiceDate: "",
    dueDate: "",
    notes: "",
    status: "PENDING", // or "unpaid" - adapt to your usage
    tax: 0,
    discount: 0,
  });

  // Optional line items
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  // If editing, load the invoice + items
  useEffect(() => {
    if (!invoiceId) return; // create mode
    loadExistingInvoice(invoiceId);
    // eslint-disable-next-line
  }, [invoiceId]);

  async function loadExistingInvoice(id) {
    try {
      // 1) Load invoice from PocketBase
      const existing = await pb.collection("invoices").getOne(id);

      // 2) Load invoiceItems if needed
      const relatedItems = await pb.collection("invoiceItems").getFullList({
        filter: `invoice = "${id}"`,
      });

      // 3) Merge data into our form
      setForm({
        invoiceNo: existing.invoiceNo || "",
        fromName: existing.fromName || "",
        fromEmail: existing.fromEmail || "",
        fromAddress: existing.fromAddress || "",
        toName: existing.toName || "",
        toEmail: existing.toEmail || "",
        toAddress: existing.toAddress || "",
        invoiceDate: existing.invoiceDate || "",
        dueDate: existing.dueDate || "",
        notes: existing.notes || "",
        status: existing.status || "PENDING",
        tax: existing.tax || 0,
        discount: existing.discount || 0,
      });

      // Convert the related items
      const parsedItems = relatedItems.map((it) => ({
        id: it.id, // for potential reference if we want to update them
        description: it.description || "",
        quantity: it.quantity || 1,
        rate: it.rate || 0,
      }));
      setItems(parsedItems.length > 0 ? parsedItems : [{ description: "", quantity: 1, rate: 0 }]);

    } catch (err) {
      console.error("Error loading existing invoice:", err);
    }
  }

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleItemChange(idx, field, value) {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  // Optional: calculate final due (base - discount + tax)
  function calculateFinalDue() {
    // If you have a separate "base" field, you might do:
    // let base = parseFloat(existing.amount_due). Or you
    // might store "amount_due" in the form as well.
    // For simplicity, let's do:
    // sum(items.map(item => item.quantity * item.rate)) - discount + tax
    const subTotal = items.reduce(
      (acc, it) => acc + parseFloat(it.rate || 0) * parseInt(it.quantity || 1),
      0
    );
    const discount = parseFloat(form.discount) || 0;
    const tax = parseFloat(form.tax) || 0;

    return subTotal - discount + tax;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // If you want to store something like "amount_due" in the invoice,
    // you could do:
    const amountDue = calculateFinalDue();

    // Build the invoice data to send
    const invoiceData = {
      invoiceNo: form.invoiceNo,
      fromName: form.fromName,
      fromEmail: form.fromEmail,
      fromAddress: form.fromAddress,
      toName: form.toName,
      toEmail: form.toEmail,
      toAddress: form.toAddress,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      notes: form.notes,
      status: form.status,
      tax: parseFloat(form.tax) || 0,
      discount: parseFloat(form.discount) || 0,
      amount_due: amountDue, // if you have an "amount_due" field in your PB schema
    };

    try {
      let savedInvoice;
      if (!invoiceId) {
        // CREATE mode
        savedInvoice = await pb.collection("invoices").create(invoiceData);
      } else {
        // EDIT mode
        savedInvoice = await pb.collection("invoices").update(invoiceId, invoiceData);
      }

      // For line items, we can either create/update them.
      // Simple approach: if editing, delete existing items & recreate. 
      // Or do a more advanced approach with upserts.

      // 1) If editing, remove all old items then recreate:
      if (invoiceId) {
        // fetch old items
        const oldItems = await pb.collection("invoiceItems").getFullList({
          filter: `invoice = "${invoiceId}"`,
        });
        // delete them
        for (const old of oldItems) {
          await pb.collection("invoiceItems").delete(old.id);
        }
      }

      // 2) Create new items
      for (const it of items) {
        // If you want to skip blank items, do a check
        if (!it.description && !it.rate) continue;

        await pb.collection("invoiceItems").create({
          description: it.description,
          quantity: parseInt(it.quantity) || 1,
          rate: parseFloat(it.rate) || 0,
          invoice: savedInvoice.id, // link to the invoice
        });
      }

      alert(`Invoice ${invoiceId ? "updated" : "created"} successfully`);
      if (onSaved) onSaved();

    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Failed to save invoice");
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{invoiceId ? "Edit" : "Create"} Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Invoice No</label>
          <br />
          <input
            name="invoiceNo"
            type="text"
            value={form.invoiceNo}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>From Name</label>
          <br />
          <input
            name="fromName"
            value={form.fromName}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label>From Email</label>
          <br />
          <input
            name="fromEmail"
            value={form.fromEmail}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label>From Address</label>
          <br />
          <textarea
            name="fromAddress"
            value={form.fromAddress}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>To Name</label>
          <br />
          <input
            name="toName"
            value={form.toName}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label>To Email</label>
          <br />
          <input
            name="toEmail"
            value={form.toEmail}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label>To Address</label>
          <br />
          <textarea
            name="toAddress"
            value={form.toAddress}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>Invoice Date</label>
          <br />
          <input
            name="invoiceDate"
            type="date"
            value={form.invoiceDate}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <label>Due Date</label>
          <br />
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>Tax</label>
          <br />
          <input
            name="tax"
            type="number"
            step="0.01"
            value={form.tax}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>Discount</label>
          <br />
          <input
            name="discount"
            type="number"
            step="0.01"
            value={form.discount}
            onChange={handleFieldChange}
          />
        </div>

        <div>
          <label>Status</label>
          <br />
          <select name="status" value={form.status} onChange={handleFieldChange}>
            <option value="PENDING">PENDING</option>
            <option value="unpaid">unpaid</option>
            <option value="partial">partial</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
          </select>
        </div>

        <div>
          <label>Notes</label>
          <br />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleFieldChange}
          />
        </div>

        <hr />
        <h3>Items</h3>
        {items.map((it, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "0.5rem" }}>
            <label>Description</label>
            <br />
            <input
              value={it.description}
              onChange={(e) => handleItemChange(idx, "description", e.target.value)}
            />
            <br />

            <label>Quantity</label>
            <br />
            <input
              type="number"
              value={it.quantity}
              onChange={(e) =>
                handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)
              }
            />
            <br />

            <label>Rate</label>
            <br />
            <input
              type="number"
              step="0.01"
              value={it.rate}
              onChange={(e) =>
                handleItemChange(idx, "rate", parseFloat(e.target.value) || 0)
              }
            />
            <br />

            <button type="button" onClick={() => removeItem(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Calculated Subtotal:</strong> ${calculateFinalDue().toFixed(2)}
          </p>

          <button type="submit">
            {invoiceId ? "Update Invoice" : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
