// File: src/hooks/useInvoices.js

import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearErrors = () => setError(null);

  // Fetch all invoices
  const fetchInvoices = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
      // If you want the allocation info expanded, include it here:
      // e.g. expand: "allocation_id"
      const response = await pb.collection("invoices").getList(1, 100);
      setInvoices(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new invoice
  const addInvoice = async (invoiceData) => {
    clearErrors();
    setLoading(true);
    try {
      const newInvoice = await pb.collection("invoices").create(invoiceData);
      // Optionally fetch the newly created record with expansions
      const fetchedInvoice = await pb
        .collection("invoices")
        .getOne(newInvoice.id, { expand: "allocation_id" });

      setInvoices((prev) => [...prev, fetchedInvoice]);
      setSuccessMessage("Invoice created successfully!");
      return fetchedInvoice;
    } catch (err) {
      setError(err.message || "Failed to create invoice");
      throw err; // so external code can handle it
    } finally {
      setLoading(false);
    }
  };

  // Update an existing invoice
  const updateInvoice = async (invoiceId, updatedData) => {
    clearErrors();
    setLoading(true);
    try {
      const updatedInvoice = await pb
        .collection("invoices")
        .update(invoiceId, updatedData);
      // Optionally refetch with expansions
      const fetchedInvoice = await pb
        .collection("invoices")
        .getOne(updatedInvoice.id, { expand: "allocation_id" });

      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? fetchedInvoice : inv))
      );
      setSuccessMessage("Invoice updated successfully!");
      return fetchedInvoice;
    } catch (err) {
      setError(err.message || "Failed to update invoice");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an invoice
  const deleteInvoice = async (invoiceId) => {
    clearErrors();
    setLoading(true);
    try {
      await pb.collection("invoices").delete(invoiceId);
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
      setSuccessMessage("Invoice deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  // Load invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
    invoices,
    loading,
    error,
    successMessage,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
  };
}
