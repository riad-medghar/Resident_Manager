import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';

const VacantRooms = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

{/*    useEffect(() => {
        // Fetch the list of vacant rooms from your API or data source
        fetch('/api/rooms/vacant')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching vacant rooms:', error));
    }, []);
*/}
       useEffect(() => {
        // Static example data for vacant rooms
        const exampleRooms = [
            { number: 101, type: 'Single' },
            { number: 102, type: 'Double' },
            { number: 103, type: 'Suite' }
        ];
        setRooms(exampleRooms);
    }, []);

        const allocateRoom = (roomNumber) => {
        navigate(`/rooms/allocate/${roomNumber}`);
        
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Vacant Rooms</h2>
            <ul className="space-y-4">
                {rooms.map((room, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                       <div className="flex justify-between items-center space-between ">
                        <p className=" px-4 font-medium">Room Number: {room.number}</p>
                        <p className="text-sm text-gray-600">Type: {room.type}</p>
                        </div>
                        <button 
                            onClick={() => allocateRoom(room.number)}
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
