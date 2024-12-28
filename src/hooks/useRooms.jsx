import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

// Initialize PocketBase
const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

// Hook for fetching rooms
export function useFetchRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await pb.collection("rooms").getList(1, 50);
      setRooms(response.items);
    } catch (err) {
      setError(err.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Derive total occupied and available rooms
  const availableRooms = rooms.filter((room) => room.status === "available");
  const totalAvailableRooms = availableRooms.length;
  const totalOccupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const totalReservedRooms = rooms.filter((room) => room.status === "reserved").length;
  const totalRooms = rooms.length

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, loading, error, fetchRooms, setRooms,availableRooms, totalAvailableRooms, totalOccupiedRooms,totalReservedRooms, totalRooms, };
}

// Hook for room management
export function useRooms(rooms, setRooms) {
  const [error, setError] = useState(null);

  const addRoom = async (newRoom) => {
    try {
      const response = await pb.collection("rooms").create(newRoom);
      setRooms((prevRooms) => [...prevRooms, response]);
    } catch (err) {
      setError(err.message || "Failed to add room");
    }
  };

  const updateRoomStatus = async (roomId, status) => {
    try {
        // console.log("Updating room:", roomId, "to status:", status);
        const response = await pb.collection("rooms").update(roomId, { status });

        // Ensure setRooms is callable
        if (typeof setRooms === "function") {
            setRooms((prevRooms) =>
                prevRooms.map((room) => (room.id === roomId ? response : room))
            );
        } else {
            // console.warn("setRooms is not defined or not a function.");
        }

        //console.log("Room update response:", response);
        return response; // Return the updated room object
    } catch (err) {
        // console.error("Error updating room status:", err.message);
        setError(err.message || "Failed to update room status");
        throw new Error("Failed to update room status.");
    }
  };
  

  const deleteRoom = async (roomId) => {
    try {
      await pb.collection("rooms").delete(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    } catch (err) {
      setError(err.message || "Failed to delete room");
    }
  };

  return { addRoom, updateRoomStatus, deleteRoom, error };
}
