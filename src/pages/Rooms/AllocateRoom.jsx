import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Hooks
import useFetchRooms from "../../hooks/useFetchRooms";
import { useRooms } from "../../hooks/useRooms";
import useResidents from "../../hooks/useResidents";
import useAllocations from "../../hooks/useAllocations";

export default function AllocateRoom() {
  const { roomNumber } = useParams();

  // Hooks for rooms, residents, and allocations
  const { availableRooms, fetchRooms } = useFetchRooms();
  const { updateRoomStatus } = useRooms();
  const { residents, fetchResidents } = useResidents();
  const { addAllocation } = useAllocations();

  // Form state
  const [residentQuery, setResidentQuery] = useState("");
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [duration, setDuration] = useState("");
  const [leaseExpiration, setLeaseExpiration] = useState("");

  // Fetch data once
  useEffect(() => {
    fetchRooms();
    fetchResidents();
  }, [fetchRooms, fetchResidents]);


  // If a `roomNumber` param was provided, auto-select that room if available
  useEffect(() => {
    if (!roomNumber) return;
    const match = availableRooms.find((r) => r.room_number === roomNumber);
    if (match) setSelectedRoomId(match.id);
  }, [roomNumber, availableRooms]);

  // Filter residents by query
  useEffect(() => {
    if (!residentQuery) {
      setFilteredResidents([]);
      return;
    }
    const q = residentQuery.toLowerCase();
    const results = residents.filter((r) =>
      `${r.first_name || ""} ${r.last_name || ""}`.toLowerCase().includes(q)
    );
    setFilteredResidents(results);
  }, [residentQuery, residents]);

  // Lease expiration
  useEffect(() => {
    if (!duration || +duration <= 0) {
      setLeaseExpiration("");
      return;
    }
    const now = new Date();
    now.setMonth(now.getMonth() + parseInt(duration, 10));
    setLeaseExpiration(now.toISOString().split("T")[0]);
  }, [duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedResident) {
      alert("Please select a resident from the suggestions.");
      return;
    }

    if (!selectedRoomId) {
      alert("Please select a valid room.");
      return;
    }

    if (!duration || duration <= 0) {
      alert("Please enter a valid duration (in months).");
      return;
    }

    try {
        // 1) Create an allocation in PocketBase
        const startDate = new Date().toISOString().split("T")[0];
        const newAlloc = await addAllocation({
          resident_id: selectedResident.id,
          room_id: selectedRoomId,
          start_date: startDate,
          end_date: leaseExpiration,
          status: "active",
          notes: `Allocated for ${duration} months`,
        });
  
        // 2) Mark the chosen room “occupied”
        await updateRoomStatus(selectedRoomId, "occupied");
  
        // 3) Optionally re-fetch the rooms so your local data is up to date
        await fetchRooms();
  
        alert(`Success! Allocation #${newAlloc.id} created. Room set to occupied.`);
        resetForm();
      } catch (error) {
        console.error("Failed to allocate room:", error);
        alert("Error creating allocation.");
      }
    }
  
    function resetForm() {
      setResidentQuery("");
      setFilteredResidents([]);
      setSelectedResident(null);
      setSelectedRoomId("");
      setDuration("");
      setLeaseExpiration("");
    }


  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Allocate Room</h2>
      <form onSubmit={handleSubmit}>
        {/* Resident Search */}
        <div className="mb-4">
          <label className="block mb-1">Resident Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Start typing to search residents..."
            value={residentQuery}
            onChange={(e) => {
              setResidentQuery(e.target.value);
              setSelectedResident(null); // Reset selection if query changes
            }}
          />
          {filteredResidents.length > 0 && (
            <ul className="border rounded mt-2 max-h-40 overflow-auto">
              {filteredResidents.map((res) => (
                <li
                  key={res.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSelectedResident(res);
                    setResidentQuery(`${res.first_name} ${res.last_name}`);
                    setFilteredResidents([]);
                  }}
                >
                  {res.first_name} {res.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Room Dropdown */}
        <div className="mb-4">
          <label className="block mb-1">Available Rooms</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
          >
            <option value="">-- Select a room --</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_number} (Floor: {room.floor}, Type: {room.room_type})
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="block mb-1">Duration (months)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter duration in months"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        {/* Lease Expiration */}
        {leaseExpiration && (
          <p className="mb-4 text-gray-700">
            Lease Expiration: <strong>{leaseExpiration}</strong>
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Allocate Room
        </button>
      </form>
    </div>
  );
}
