import React from 'react';
import { useFetchRooms } from '../../hooks/useRooms';



const RoomOccupancy = () => {
    const {
        rooms,
        loading,
        error,
        totalOccupiedRooms,
        totalAvailableRooms,
    } = useFetchRooms();


    const occupancyPercentage = totalOccupiedRooms + totalAvailableRooms > 0 
    ? Math.round((totalOccupiedRooms / (totalOccupiedRooms + totalAvailableRooms)) * 100)
    : 0;

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Room Occupancy</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div 
                            className="bg-indigo-600 h-4 rounded-full" 
                            style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Occupied Rooms</p>
                            <p className="text-lg font-bold">{totalOccupiedRooms}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Vacant Rooms</p>
                            <p className="text-lg font-bold">{totalAvailableRooms}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RoomOccupancy;