import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AllocateRoom = () => {
    const { roomNumber } = useParams();
    const [residentName, setResidentName] = useState('');
    const [room, setRoom] = useState(roomNumber && roomNumber > 0 ? roomNumber : '');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to allocate the room to the resident
        console.log(`Allocating room number ${room} to resident ${residentName}`);
        // Add your API call or other logic here
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Allocate Room {roomNumber && roomNumber > 0 ? roomNumber : ''}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="residentName">
                        Resident Name
                    </label>
                    <input
                        id="residentName"
                        type="text"
                        value={residentName}
                        onChange={(e) => setResidentName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {(!roomNumber || roomNumber < 0) && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomNumber">
                            Room Number
                        </label>
                        <input
                            id="roomNumber"
                            type="text"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                        Duration (in months)
                    </label>
                    <input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Assign Resident
                </button>
            </form>
        </div>
    );
};

export default AllocateRoom;
