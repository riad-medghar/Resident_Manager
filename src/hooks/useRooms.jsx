// File: src/hooks/useRooms.js
import { useState } from "react";
import pb from "../pocketsdk.js";

/**
 * Hook for room mutations (create, update, delete).
 * Doesn't manage an internal rooms state.
 * If you want to see updated data, call `fetchRooms()` from `useFetchRooms`.
 */
export function useRooms() {
  const [error, setError] = useState(null);

  // Create a new room
  const addRoom = async (newRoom) => {
    try {
      const response = await pb.collection("rooms").create(newRoom);
      return response; // Return the created room object
    } catch (err) {
      setError(err.message || "Failed to add room");
      throw err;
    }
  };

  // Update a room's status
  const updateRoomStatus = async (roomId, status) => {
    try {
      const response = await pb.collection("rooms").update(roomId, { status });
      return response; // Return the updated room object
    } catch (err) {
      setError(err.message || "Failed to update room status");
      throw err;
    }
  };

  // Delete a room
  const deleteRoom = async (roomId) => {
    try {
      await pb.collection("rooms").delete(roomId);
    } catch (err) {
      setError(err.message || "Failed to delete room");
      throw err;
    }
  };

  return {
    addRoom,
    updateRoomStatus,
    deleteRoom,
    error,
  };
}
