// File: src/hooks/usePayments.js

import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js";

export default function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearErrors = () => setError(null);

  // Fetch all payments
  const fetchPayments = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
      // If you want the related resident + invoice data, expand them:
      // e.g. expand: "resident_id,invoice_id"
      const response = await pb.collection("payments").getList(1, 100, {
        sort: "-created",
        expand: "resident_id,invoice_id",
      });
      setPayments(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new payment
  const addPayment = async (paymentData) => {
    clearErrors();
    setLoading(true);
    try {
      const newPayment = await pb.collection("payments").create(paymentData);
      // Optionally fetch the newly created record with expansions
      const fetchedPayment = await pb
        .collection("payments")
        .getOne(newPayment.id, { expand: "resident_id,invoice_id" });

      setPayments((prev) => [...prev, fetchedPayment]);
      setSuccessMessage("Payment recorded successfully!");
      return fetchedPayment;
    } catch (err) {
      setError(err.message || "Failed to record payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing payment
  const updatePayment = async (paymentId, updatedData) => {
    clearErrors();
    setLoading(true);
    try {
      const updatedPayment = await pb
        .collection("payments")
        .update(paymentId, updatedData);
      // Optionally refetch with expansions
      const fetchedPayment = await pb
        .collection("payments")
        .getOne(updatedPayment.id, { expand: "resident_id,invoice_id" });

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? fetchedPayment : p))
      );
      setSuccessMessage("Payment updated successfully!");
      return fetchedPayment;
    } catch (err) {
      setError(err.message || "Failed to update payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a payment
  const deletePayment = async (paymentId) => {
    clearErrors();
    setLoading(true);
    try {
      await pb.collection("payments").delete(paymentId);
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      setSuccessMessage("Payment deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete payment");
    } finally {
      setLoading(false);
    }
  };

  // Load payments on mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    successMessage,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
  };
}
