import React from "react";
import { useNavigate } from "react-router-dom";
import useFetchRooms from '../../hooks/useFetchRooms'; // Import the updated hook

const statusColor  = {
    available: "bg-green-500 hover:bg-green-600",
    occupied: "bg-blue-500 hover:bg-blue-600",
    maintenance: "bg-yellow-500 hover:bg-yellow-600",
}

const RoomsList = () => {
    const navigate = useNavigate();
    const { rooms, loading, error } = useFetchRooms(); // Use the updated hook

    const manageRoom = (roomNumber) => {
        navigate(`/rooms/manage/${roomNumber}`); // Pass roomNumber
    };

    if (loading) {
        return <div className="text-center mt-8">Loading rooms...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold pt-4 text-gray-800 text-center">Rooms Overview</h2>   
            <div className="flex flex-col justify-center items-center mt-8">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    {/* Rooms Grid */}
                    <div className="grid grid-cols-7 gap-4">
                        {rooms.map((room) => (
                            <div
                                key={room.id} // Changed from 'room_number' to 'id' for uniqueness
                                className={`
                                    aspect-square rounded-lg shadow-md p-4
                                    flex flex-col items-center justify-center
                                    transition-all duration-200 hover:shadow-lg
                                    ${statusColor[room.status]}`}
                                onClick={() => manageRoom(room.room_number)}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="text-white font-bold text-lg">
                                    {room.room_number}
                                </span>
                                <span className="text-white text-sm capitalize mt-1">
                                    {room.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomsList;
