import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js"

const useResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearErrors = () => setError(null);

  const fetchResidents = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
      const response = await pb.collection("residents").getList(1, 50);
      setResidents(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch residents");
    } finally {
      setLoading(false);
    }
  }, []);

  const addResident = async (residentData) => {
    clearErrors();
    setLoading(true);
    try {
      const newResident = await pb.collection("residents").create(residentData);
      const fetchedResident = await pb.collection("residents").getOne(newResident.id);
      setResidents((prev) => [...prev, fetchedResident]);
      setSuccessMessage("Resident added successfully!");
      return fetchedResident;
    } catch (err) {
      setError(err.message || "Failed to add resident");
      throw err; // Allow external error handling
    } finally {
      setLoading(false);
    }
  };

  const updateResident = async (residentId, updatedData) => {
    clearErrors();
    setLoading(true);
    try {
      const updatedResident = await pb.collection("residents").update(residentId, updatedData);
      setResidents((prev) =>
        prev.map((resident) => (resident.id === residentId ? updatedResident : resident))
      );
      setSuccessMessage("Resident updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update resident");
    } finally {
      setLoading(false);
    }
  };

  const deleteResident = async (residentId) => {
    clearErrors();
    setLoading(true);
    try {
      await pb.collection("residents").delete(residentId);
      setResidents((prev) => prev.filter((resident) => resident.id !== residentId));
      setSuccessMessage("Resident deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete resident");
    } finally {
      setLoading(false);
    }
  };

  const totalResidents = residents.length;

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  return {
    residents,
    totalResidents,
    loading,
    error,
    successMessage,
    addResident,
    updateResident,
    deleteResident,
    fetchResidents,
  };
};

export default useResidents;
