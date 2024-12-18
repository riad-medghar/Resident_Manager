import React from "react";
import { useNavigate } from "react-router-dom";

const rooms = [
  { number: 101, status: "available" },
  { number: 102, status: "occupied" },
  { number: 103, status: "available" },
  { number: 104, status: "occupied" },
  { number: 105, status: "available" },
  { number: 106, status: "occupied" },
  { number: 107, status: "available" },
  { number: 108, status: "occupied" },
  { number: 109, status: "available" },
  { number: 110, status: "maintenance" },
  { number: 111, status: "available" },
  { number: 112, status: "occupied" },
];
    const statusColor  = {
    available: "bg-green-500 hover:bg-green-600",
    occupied: "bg-blue-500 hover:bg-blue-600",
    maintenance: "bg-yellow-500 hover:bg-yellow-600",
    }
 const RoomsList = () => {
    const navigate = useNavigate();
    const manageRoom = (roomNumber) => {
        navigate(`/rooms/manage`);
    };
  

  return (


    <div className="min-h-screen bg-gray-100">
           <h2 className="text-3xl font-bold  pt-4 text-gray-800 text-center">Rooms Overview</h2>   
        <div className="flex flex-col justify-center items-center mt-8">
         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
            {/* Rooms Grid */}
            <div className="grid grid-cols-7 gap-4">
            {rooms.map((room) => (
                <div
                 key={room.number}
                 className={`
                   aspect-square rounded-lg shadow-md p-4
                   flex flex-col items-center justify-center
                   transition-all duration-200 hover:shadow-lg
                   ${statusColor[room.status]}`}
                   onClick={() => manageRoom(room.number)}
                   style={{ cursor: "pointer" }}
                    
            >
              <span className="text-white font-bold text-lg">
                {room.number}
              </span>
              <span className="text-white text-sm capitalize mt-1">
                {room.status}
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
