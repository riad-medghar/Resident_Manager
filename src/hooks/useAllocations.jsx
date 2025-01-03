import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js"


const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearErrors = () => setError(null);

  // Fetch all allocations
  const fetchAllocations = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
    // Expand the relations so we get the actual resident & room objects:
    const response = await pb.collection("allocations").getList(1, 100, {
      sort: "-created",
      expand: "resident_id,room_id"
    }); 
    setAllocations(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [fetchAllocations]);

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
