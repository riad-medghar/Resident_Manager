import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearErrors = () => setError(null);

  // Fetch all allocations
  const fetchAllocations = async () => {
    clearErrors();
    setLoading(true);
    try {
      const response = await pb.collection("allocations").getList(1, 50);
      setAllocations(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  };

  // Create a new allocation
  const addAllocation = async (allocationData) => {
    clearErrors();
    setLoading(true);
    try {
      const newAllocation = await pb.collection("allocations").create(allocationData);
      const fetchedAllocation = await pb.collection("allocations").getOne(newAllocation.id);
      setAllocations((prev) => [...prev, fetchedAllocation]);
      setSuccessMessage("Allocation created successfully!");
      return fetchedAllocation;
    } catch (err) {
      setError(err.message || "Failed to create allocation");
      throw err; // Allow external error handling
    } finally {
      setLoading(false);
    }
  };

  // Update an existing allocation
  const updateAllocation = async (allocationId, updatedData) => {
    clearErrors();
    setLoading(true);
    try {
      const updatedAllocation = await pb.collection("allocations").update(allocationId, updatedData);
      setAllocations((prev) =>
        prev.map((allocation) => (allocation.id === allocationId ? updatedAllocation : allocation))
      );
      setSuccessMessage("Allocation updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update allocation");
    } finally {
      setLoading(false);
    }
  };

  // Delete an allocation
  const deleteAllocation = async (allocationId) => {
    clearErrors();
    setLoading(true);
    try {
      await pb.collection("allocations").delete(allocationId);
      setAllocations((prev) => prev.filter((allocation) => allocation.id !== allocationId));
      setSuccessMessage("Allocation deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete allocation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  return {
    allocations,
    loading,
    error,
    successMessage,
    fetchAllocations,
    addAllocation,
    updateAllocation,
    deleteAllocation,
  };
};

export default useAllocations;
