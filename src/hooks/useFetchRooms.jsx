// File: src/hooks/useFetchRooms.js
import { useState, useEffect, useCallback, useMemo } from "react";
import pb from "../pocketsdk.js";

/**
 * Hook for reading a list of rooms from PocketBase.
 * This hook:
 *  - Manages its own internal rooms state
 *  - Has a stable fetchRooms function
 *  - Derives availableRooms, etc. with useMemo
 */
export default function useFetchRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pb.collection("rooms").getList(1, 50);
      setRooms(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  // Derive data with useMemo so we don't cause re-renders
  const availableRooms = useMemo(
    () => rooms.filter((room) => room.status === "available"),
    [rooms]
  );
  const totalAvailableRooms = availableRooms.length;
  const totalOccupiedRooms = useMemo(
    () => rooms.filter((room) => room.status === "occupied").length,
    [rooms]
  );
  const totalReservedRooms = useMemo(
    () => rooms.filter((room) => room.status === "reserved").length,
    [rooms]
  );
  const totalRooms = rooms.length;

  // Fetch once on mount
  useEffect(() => {
    fetchRooms();
    // If fetchRooms is stable (wrapped in useCallback with no changing deps),
    // this runs exactly once
  }, [fetchRooms]);

  return {
    rooms,
    availableRooms,
    totalAvailableRooms,
    totalOccupiedRooms,
    totalReservedRooms,
    totalRooms,
    loading,
    error,
    fetchRooms,
  };
}
