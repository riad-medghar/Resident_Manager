import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Key, LogOut } from 'lucide-react';
import { useParams } from 'react-router-dom';

const RoomManagement = () => {
    const {roomNumber} = useParams();
  const [rooms, setRooms] = useState([
    { id: 1, number: "101", type: "Single", status: "available", price: 100, floor: 1 },
    { id: 2, number: "102", type: "Double", status: "occupied", price: 150, floor: 1 },
    { id: 3, number: "103", type: "Suite", status: "maintenance", price: 200, floor: 1 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "Single",
    status: "available",
    price: "",
    floor: ""
  });
  useEffect(() => {
    if (roomNumber && roomNumber > 0) {
      setSelectedRoom(rooms.find(room => room.number === parseInt(roomNumber)));
    }
    },[roomNumber,rooms]);

  // Add Room
  const handleAddRoom = () => {
    setRooms([...rooms, { ...newRoom, id: rooms.length + 1 }]);
    setShowAddModal(false);
    setNewRoom({ number: "", type: "Single", status: "available", price: "", floor: "" });
  };

  // Update Room
  const handleUpdateRoom = (roomId, updatedData) => {
    setRooms(rooms.map(room => room.id === roomId ? { ...room, ...updatedData } : room));
    setSelectedRoom(null);
  };

  // Delete Room
  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  // Allocate/Deallocate Room
  const handleRoomAllocation = (roomId, allocate = true) => {
    handleUpdateRoom(roomId, { status: allocate ? "occupied" : "available" });
  };

  // Set Maintenance
  const handleSetMaintenance = (roomId) => {
    handleUpdateRoom(roomId, { status: "maintenance" });
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
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
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Room</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Floor</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="border-t">
                    <td className="p-4">{room.number}</td>
                    <td className="p-4">{room.type}</td>
                    <td className="p-4">
                      <span className={`capitalize ${
                        room.status === 'available' ? 'text-green-500' :
                        room.status === 'occupied' ? 'text-blue-500' :
                        'text-yellow-500'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4">${room.price}</td>
                    <td className="p-4">{room.floor}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRoom(room)}
                          className="p-2 hover:bg-gray-100 rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 hover:bg-gray-100 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {room.status === "available" ? (
                          <button
                            onClick={() => handleRoomAllocation(room.id, true)}
                            className="p-2 hover:bg-gray-100 rounded-md"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                        ) : room.status === "occupied" ? (
                          <button
                            onClick={() => handleRoomAllocation(room.id, false)}
                            className="p-2 hover:bg-gray-100 rounded-md"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleSetMaintenance(room.id)}
                          className="p-2 hover:bg-gray-100 rounded-md"
                        >
                          <p className="w-4 h-4" /> {/* Changed Tool to Info */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                value={newRoom.number}
                onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={newRoom.price}
                onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Floor"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Room</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={selectedRoom.number}
                onChange={(e) => setSelectedRoom({...selectedRoom, number: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <select
                value={selectedRoom.type}
                onChange={(e) => setSelectedRoom({...selectedRoom, type: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={selectedRoom.price}
                onChange={(e) => setSelectedRoom({...selectedRoom, price: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Floor"
                value={selectedRoom.floor}
                onChange={(e) => setSelectedRoom({...selectedRoom, floor: e.target.value})}
                className="w-full p-2 border rounded-md"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateRoom(selectedRoom.id, selectedRoom)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update Room
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
