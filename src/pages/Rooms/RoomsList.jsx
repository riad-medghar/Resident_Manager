import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchRooms } from "../../hooks/useRooms";

const statusColor = {
  available: "bg-green-500 hover:bg-green-600",
  occupied: "bg-blue-500 hover:bg-blue-600",
  maintenance: "bg-yellow-500 hover:bg-yellow-600",
  reserved: "bg-red-500 hover:bg-red-600"
};

const RoomsList = () => {
  const navigate = useNavigate();
  const { rooms, loading, error } = useFetchRooms();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRooms = rooms.filter((room) =>
    statusFilter === "all" ? true : room.status === statusFilter
  );

  const manageRoom = (roomNumber) => {
    navigate(`/rooms/manage`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold pt-4 text-gray-800 text-center">
        Rooms Overview
      </h2>
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 w-full max-w-sm mb-6"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>

          {loading ? (
            <p className="text-gray-600">Loading rooms...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`
                    aspect-square rounded-lg shadow-md p-4
                    flex flex-col items-center justify-center
                    transition-all duration-200 hover:shadow-lg
                    ${statusColor[room.status]}
                  `}
                  onClick={() => manageRoom(room.room_number)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="text-white font-bold text-lg">
                    {room.room_number}
                  </span>
                  <span className="text-white text-sm capitalize mt-1">
                    {room.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsList;