import React from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { User, Home, Calendar, CreditCard } from 'lucide-react';

// Mock data - in a real application, this would come from an API
const residentDetails = {
  1: {
    id: 1,
    name: 'John Doe',
    age: 35,
    roomNumber: '101',
    occupancyStart: '2023-06-15',
    personsInRoom: 1,
    previousRooms: ['205', '310'],
    paymentHistory: [
      { month: 'Jan', amount: 1200 },
      { month: 'Feb', amount: 1250 },
      { month: 'Mar', amount: 1200 },
      { month: 'Apr', amount: 1300 },
      { month: 'May', amount: 1250 },
      { month: 'Jun', amount: 1200 }
    ],
    profileImage: '/api/placeholder/200/200'
  }
};

const ResidentDetails = () => {
  const { residentId } = useParams();
  const resident = residentDetails[residentId];

  if (!resident) {
    return <div>Resident not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <img 
            src={resident.profileImage} 
            alt={resident.name} 
            className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
          />
          <h2 className="text-2xl font-bold text-gray-800">{resident.name}</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center">
              <User className="mr-2 text-gray-500" />
              <span>{resident.age} years old</span>
            </div>
            <div className="flex items-center justify-center">
              <Home className="mr-2 text-gray-500" />
              <span>Room {resident.roomNumber}</span>
            </div>
            <div className="flex items-center justify-center">
              <Calendar className="mr-2 text-gray-500" />
              <span>Occupying since {resident.occupancyStart}</span>
            </div>
            <div className="flex items-center justify-center">
              <CreditCard className="mr-2 text-gray-500" />
              <span>{resident.personsInRoom} person(s) in room</span>
            </div>
          </div>
        </div>

        {/* Payment History Graph */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Monthly Payment History</h3>
          <LineChart width={600} height={300} data={resident.paymentHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </div>

        {/* Previous Rooms */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Previous Rooms</h3>
          <ul className="space-y-2">
            {resident.previousRooms.map((room, index) => (
              <li 
                key={room} 
                className="bg-gray-100 px-4 py-2 rounded-md flex justify-between items-center"
              >
                <span>Room {room}</span>
                <span className="text-sm text-gray-500">
                  {index === 0 ? 'Most Recent' : `Previous ${index + 1}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetails;