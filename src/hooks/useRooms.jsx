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

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, loading, error, fetchRooms, setRooms };
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
      const response = await pb.collection("rooms").update(roomId, { status });
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === roomId ? response : room))
      );
    } catch (err) {
      setError(err.message || "Failed to update room status");
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
