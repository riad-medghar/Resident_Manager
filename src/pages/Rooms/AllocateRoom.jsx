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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <Building className="mr-3" /> Room Allocation
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Selection</h2>
                        
                        {/* Resident Name */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Resident Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="resident_name"
                                        value={formData.resident_name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.resident_name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        placeholder="Enter resident name"
                                    />
                                    {errors.resident_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.resident_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Room Selection */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Select Room
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select
                                        name="room_number"
                                        value={formData.room_number}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.room_number ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    >
                                        <option value="">Select a room</option>
                                        {availableRooms.map(room => (
                                            <option key={room.id} value={room.number}>{room.number}</option>
                                        ))}
                                    </select>
                                    {errors.room_number && (
                                        <p className="text-red-500 text-sm mt-1">{errors.room_number}</p>
                                    )}
                                </div>
                            </div>

                            {/* Move-in Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Move-in Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="move_in_date"
                                        value={formData.move_in_date}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.move_in_date ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    />
                                    {errors.move_in_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.move_in_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Move-out Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Move-out Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="move_out_date"
                                        value={formData.move_out_date}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.move_out_date ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    />
                                    {errors.move_out_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.move_out_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Payment Method
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select
                                        name="payment_method"
                                        value={formData.payment_method}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.payment_method ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="full">Full Payment</option>
                                    </select>
                                    {errors.payment_method && (
                                        <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={roomsLoading}
                            className={`${
                                roomsLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg font-semibold`}
                        >
                            {roomsLoading ? 'Allocating...' : 'Allocate Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AllocateRoom;