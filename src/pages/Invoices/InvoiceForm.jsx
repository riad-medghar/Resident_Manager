import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import pb from "../../pocketsdk";

export default function InvoiceForm() {
  const { invoiceId } = useParams();
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
      navigate("/invoices");
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Failed to save invoice");
    }
  }

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
        
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Invoice" : "Create New Invoice"}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Allocation ID</label>
              <input
                className={inputClasses}
                name="allocation_id"
                value={form.allocation_id}
                onChange={handleChange}
                required
                placeholder="Enter allocation ID"
              />
            </div>

            <div>
              <label className={labelClasses}>Billing Period</label>
              <input
                className={inputClasses}
                type="date"
                name="billing_period"
                value={form.billing_period}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className={labelClasses}>Amount Due</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  className={`${inputClasses} pl-8`}
                  type="number"
                  step="0.01"
                  name="amount_due"
                  value={form.amount_due}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Amount Paid</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  className={`${inputClasses} pl-8`}
                  type="number"
                  step="0.01"
                  name="amount_paid"
                  value={form.amount_paid}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Status</label>
              <select
                className={inputClasses}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Due Date</label>
              <input
                className={inputClasses}
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Notes</label>
              <textarea
                className={`${inputClasses} min-h-[100px] resize-y`}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEdit ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}