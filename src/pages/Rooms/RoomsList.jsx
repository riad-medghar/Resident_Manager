import React, { useState } from "react";
import { useFetchRooms } from "../../hooks/useRooms";

const RoomsList = () => {
  const { rooms, loading, error } = useFetchRooms();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRooms = rooms.filter((room) =>
    statusFilter === "all" ? true : room.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold pt-4 text-gray-800 text-center">
        Rooms Overview
      </h2>
      <div className="flex flex-col justify-center items-center mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 w-full max-w-sm"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>

          {loading ? (
            <p>Loading rooms...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 rounded-lg shadow-md ${
                    room.status === "available"
                      ? "bg-green-500"
                      : room.status === "occupied"
                      ? "bg-blue-500"
                      : room.status === "maintenance"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  <h3 className="text-white font-bold">{room.room_number}</h3>
                  <p className="text-white">{room.room_type}</p>
                  <p className="text-white capitalize">{room.status}</p>
                  <p className="text-white capitalize">{room.floor}</p>
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
