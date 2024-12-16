import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchRooms from '../../hooks/useFetchRooms';

const VacantRooms = () => {
    const { rooms, loading, error } = useFetchRooms();
    const navigate = useNavigate();

    const allocateRoom = (roomId) => {
        navigate(`/rooms/allocate/${roomId}`);
    };

    if (loading) {
        return <div className="text-center text-gray-700">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Vacant Rooms</h2>
            <ul className="space-y-4">
                {rooms.available.map((room) => (
                    <li key={room.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                        <div className="flex space-x-4">
                            <p className="px-4 font-medium">Room Number: {room.Room_Number}</p>
                            <p className="text-sm text-gray-600">Type: {room.Type}</p>
                        </div>
                        <button 
                            onClick={() => allocateRoom(room.id)} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Allocate Room
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VacantRooms;
