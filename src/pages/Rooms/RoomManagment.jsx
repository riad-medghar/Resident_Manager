import React, { useState } from "react";
import { Search, Plus, Edit, Save, X, Trash2, Key, LogOut, Wrench } from "lucide-react";
import { useFetchRooms, useRooms } from "../../hooks/useRooms";

const RoomManagement = () => {
  const { rooms, setRooms, loading, error } = useFetchRooms();
  const { addRoom, updateRoomStatus, deleteRoom } = useRooms(rooms, setRooms);

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    room_type: "Single",
    status: "available",
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    room_number: "",
    room_type: "",
    status: "",
  });

  const handleRoomAllocation = (roomId, allocate = true) => {
    updateRoomStatus(roomId, allocate ? "occupied" : "available");
  };

  const handleSetMaintenance = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      console.error("Room not found");
      return;
    }
    const newStatus = room.status === "maintenance" ? "available" : "maintenance";
    updateRoomStatus(roomId, newStatus);
  };

  const handleEditClick = (room) => {
    setEditingRoom(room.id);
    setEditedDetails({ ...room });
  };

  const handleSaveEdit = async () => {
    try {
      await updateRoomStatus(editingRoom, editedDetails);
      setEditingRoom(null);
    } catch (err) {
      console.error("Failed to update room details", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Room Management System</h1>

          {/* Control Panel */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-md pl-8"
                />
                <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="maintenance">Reserved</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          </div>

          {/* Rooms Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading rooms...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left">Room</th>
                    <th className="p-4 text-left">Floor</th>
                    <th className="p-4 text-left">Type</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="border-t">
                      {editingRoom === room.id ? (
                        <>
                          <td className="p-4">
                            <input
                              type="text"
                              value={editedDetails.room_number}
                              onChange={(e) =>
                                setEditedDetails({
                                  ...editedDetails,
                                  room_number: e.target.value,
                                })
                              }
                              className="border rounded-md px-2 py-1 w-full"
                            />
                          </td>
                          <td className="p-4">
                            <select
                              value={editedDetails.room_type}
                              onChange={(e) =>
                                setEditedDetails({
                                  ...editedDetails,
                                  room_type: e.target.value,
                                })
                              }
                              className="border rounded-md px-2 py-1 w-full"
                            >
                              <option value="Single">Single</option>
                              <option value="Double">Double</option>
                              <option value="Suite">Suite</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={editedDetails.status}
                              onChange={(e) =>
                                setEditedDetails({
                                  ...editedDetails,
                                  status: e.target.value,
                                })
                              }
                              className="border rounded-md px-2 py-1 w-full"
                            >
                              <option value="available">Available</option>
                              <option value="occupied">Occupied</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="maintenance">Reserved</option>
                            </select>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4">{room.room_number}</td>
                          <td className="p-4">{room.floor}</td>
                          <td className="p-4">{room.room_type}</td>
                          <td className="p-4">{room.price}</td>
                          <td className="p-4 capitalize">
                            <span
                              className={
                                room.status === "available"
                                  ? "text-green-500"
                                  : room.status === "occupied"
                                  ? "text-blue-500"
                                  : room.status === "maintenance"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => handleEditClick(room)}
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRoom(room.id)}
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {room.status === "available" && (
                              <button
                                onClick={() => handleRoomAllocation(room.id, true)}
                                className="p-2 hover:bg-gray-100 rounded-md"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                            )}
                            {room.status === "occupied" && (
                              <button
                                onClick={() => handleRoomAllocation(room.id, false)}
                                className="p-2 hover:bg-gray-100 rounded-md"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleSetMaintenance(room.id)}
                              className="p-2 hover:bg-gray-100 rounded-md"
                            >
                              <Wrench className="w-4 h-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={newRoom.room_number}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, room_number: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
              <select
                value={newRoom.room_type}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, room_type: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addRoom(newRoom)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
