import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { User, Home, Calendar, CreditCard, List, X, DollarSign, Check } from 'lucide-react';

// Mock data with charges breakdown
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
      { 
        month: 'Jan', 
        amount: 1200,
        charges: {
          rent: 800,
          utilities: 150,
          cleaning: 100,
          parking: 100,
          maintenance: 50
        }
      },
      // ... (other months with similar structure)
    ],
    profileImage: '/api/placeholder/200/200'
  }
};

// Payment Modal Component
const PaymentModal = ({ month, charges, onClose, onConfirm }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const total = Object.values(charges).reduce((sum, value) => sum + value, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {!showConfirmation ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Payment Details - {month}
            </h2>
            
            <div className="space-y-4 mb-6">
              {Object.entries(charges).map(([name, amount]) => (
                <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="capitalize">{name}</span>
                  <span className="font-semibold">${amount}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              Process Payment
            </button>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Payment</h3>
            <p className="mb-6">Are you sure you want to process payment of ${total} for {month}?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onConfirm(month, total)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Check size={20} />
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResidentDetails = () => {
  const { residentId } = useParams();
  const resident = residentDetails[residentId];
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  if (!resident) {
    return <div>Resident not found</div>;
  }

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const paidMonths = resident.paymentHistory.map(payment => payment.month);
  const unpaidMonths = allMonths.filter(month => !paidMonths.includes(month));

  const handleMonthClick = (month) => {
    // Find payment details for the month or use default charges
    const monthData = resident.paymentHistory.find(p => p.month === month) || {
      charges: {
        rent: 800,
        utilities: 150,
        cleaning: 100,
        parking: 100,
        maintenance: 50
      }
    };
    setSelectedMonth({ month, charges: monthData.charges });
  };

  const handlePaymentConfirm = (month, amount) => {
    // Here you would typically make an API call to process the payment
    console.log(`Payment confirmed for ${month}: $${amount}`);
    setSelectedMonth(null);
    // You might want to refresh the payment history here
  };

  const MonthItem = ({ month, isPaid }) => (
    <button
      onClick={() => !isPaid && handleMonthClick(month)}
      className={`w-full px-4 py-2 rounded-md text-center transition ${
        isPaid 
          ? 'bg-green-100 cursor-not-allowed' 
          : 'bg-red-100 hover:bg-red-200 cursor-pointer'
      }`}
    >
      {month}
    </button>
  );

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Monthly Payment History</h3>
          </div>
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

        {/* Paid and Unpaid Months */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <div className='flex justify-between items-center mb-4'>
            <h3 className="text-xl font-semibold">Payment Status</h3>
            <button
              onClick={() => setIsCalendarView(!isCalendarView)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isCalendarView ? <List size={16} /> : <Calendar size={16} />}
            </button>
          </div>
          
          {isCalendarView ? (
            <div className="grid grid-cols-3 gap-4">
              {allMonths.map(month => (
                <MonthItem 
                  key={month} 
                  month={month} 
                  isPaid={paidMonths.includes(month)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Paid Months</h4>
                <ul className="space-y-2">
                  {paidMonths.map(month => (
                    <MonthItem key={month} month={month} isPaid={true} />
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Unpaid Months</h4>
                <ul className="space-y-2">
                  {unpaidMonths.map(month => (
                    <MonthItem key={month} month={month} isPaid={false} />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedMonth && (
        <PaymentModal
          month={selectedMonth.month}
          charges={selectedMonth.charges}
          onClose={() => setSelectedMonth(null)}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
};

export default ResidentDetails;