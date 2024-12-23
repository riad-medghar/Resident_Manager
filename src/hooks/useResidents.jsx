import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

const useResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const response = await pb.collection("residents").getList(1, 50); // Fetch up to 50 residents
      setResidents(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch residents");
    } finally {
      setLoading(false);
    }
  };

  const addResident = async (residentData) => {
    setLoading(true);
    try {
      const newResident = await pb.collection("residents").create(residentData);
      setResidents((prev) => [...prev, newResident]);
      setSuccessMessage("Resident added successfully!");
    } catch (err) {
      setError(err.message || "Failed to add resident");
    } finally {
      setLoading(false);
    }
  };

  const updateResident = async (residentId, updatedData) => {
    setLoading(true);
    try {
      const updatedResident = await pb.collection("residents").update(residentId, updatedData);
      setResidents((prev) =>
        prev.map((resident) =>
          resident.id === residentId ? updatedResident : resident
        )
      );
      setSuccessMessage("Resident updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update resident");
    } finally {
      setLoading(false);
    }
  };

  const deleteResident = async (residentId) => {
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

  useEffect(() => {
    fetchResidents();
  }, []);

  return {
    residents,
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
