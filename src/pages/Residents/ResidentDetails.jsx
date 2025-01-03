import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pb from '../../pocketsdk'; // Adjust path to your actual PocketBase SDK instance
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {
  User, Home, Calendar, CreditCard, List, X, DollarSign, Check
} from 'lucide-react';

/** Payment Modal Component (unchanged) **/
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
                <div
                  key={name}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
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
            <p className="mb-6">
              Are you sure you want to process payment of ${total} for {month}?
            </p>
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

/** MAIN COMPONENT **/
const ResidentDetails = () => {
  const { residentId } = useParams();
  const [resident, setResident] = useState(null);
  const [previousRooms, setPreviousRooms] = useState([]); // From allocations
  const [currentRoom, setCurrentRoom] = useState(null);   // For the occupant's active room
  const [loading, setLoading] = useState(false);

  // For Payment Modal
  const [selectedMonth, setSelectedMonth] = useState(null);

  // For toggling list vs. calendar view
  const [isCalendarView, setIsCalendarView] = useState(false);

  /**
   * We'll keep a placeholder paymentHistory array in state
   * so we can show the graph and months. Later, you might fetch
   * real payments from a "payments" collection or similar.
   */
  const [paymentHistory, setPaymentHistory] = useState([
    {
      month: 'Jan',
      amount: 1200,
      charges: {
        rent: 800,
        utilities: 150,
        cleaning: 100,
        parking: 100,
        maintenance: 50,
      },
    },
    {
      month: 'Feb',
      amount: 1150,
      charges: {
        rent: 800,
        utilities: 150,
        cleaning: 100,
        parking: 50,
        maintenance: 50,
      },
    },
    {
      month: 'Mar',
      amount: 1200,
      charges: {
        rent: 800,
        utilities: 150,
        cleaning: 100,
        parking: 100,
        maintenance: 50,
      },
    },
    // ...
  ]);

  /**
   * Because we have 12 months in the calendar, let's define them here.
   * We'll compare with the months in paymentHistory to figure out which
   * are "paid" vs. "unpaid."
   */
  const allMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // “Paid” = months we have in paymentHistory
  const paidMonths = paymentHistory.map((p) => p.month);

  // “Unpaid” = months in allMonths but not in paidMonths
  const unpaidMonths = allMonths.filter((m) => !paidMonths.includes(m));

  /**
   * Fetch the resident from PocketBase:
   *  GET /collections/residents/records/:residentId
   */
  const fetchResident = async () => {
    setLoading(true);
    try {
      const res = await pb.collection('residents').getOne(residentId);
      setResident(res);
    } catch (err) {
      console.error('Failed to fetch resident:', err);
      setResident(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch allocations for this resident, then figure out
   * which rooms they occupied in the past vs. their current room.
   * 
   * We assume you store an “active” or “occupied” status in the
   * allocations record to know which room is the current one, e.g.:
   *   "status": "active" or "ended"
   * and that "expand" includes "room_id".
   */
  const fetchResidentAllocations = async () => {
    setLoading(true);
    try {
      // Query allocations where resident_id == this resident
      // Expand to get "room_id" data
      const resp = await pb.collection('allocations').getFullList({
        filter: `resident_id = "${residentId}"`,
        expand: 'room_id',
      });

      // We can separate “current” vs. “previous” based on “status” or “end_date”
      const previousRoomNumbers = [];
      let currentRoomNumber = null;

      resp.forEach((alloc) => {
        const roomNumber = alloc.expand?.room_id?.room_number;
        if (!roomNumber) return;

        if (alloc.status === 'active') {
          // Mark as current
          currentRoomNumber = roomNumber;
        } else {
          // Mark as previous
          previousRoomNumbers.push(roomNumber);
        }
      });

      setCurrentRoom(currentRoomNumber);
      setPreviousRooms(previousRoomNumbers);

    } catch (err) {
      console.error('Failed to fetch allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch both the resident and their allocations
  useEffect(() => {
    fetchResident();
    fetchResidentAllocations();
    // eslint-disable-next-line
  }, [residentId]);

  if (loading && !resident) {
    return <div className="p-4">Loading resident details...</div>;
  }
  if (!resident) {
    return <div className="p-4">Resident not found or error loading data.</div>;
  }

  // Helper function for Payment Modal
  const handleMonthClick = (month) => {
    // If the month is in paymentHistory, find it; else use a default
    const found = paymentHistory.find((p) => p.month === month);
    const charges = found
      ? found.charges
      : {
          rent: 800,
          utilities: 150,
          cleaning: 100,
          parking: 100,
          maintenance: 50,
        };

    setSelectedMonth({ month, charges });
  };

  const handlePaymentConfirm = (month, amount) => {
    console.log(`Payment confirmed for ${month}: $${amount}`);
    setSelectedMonth(null);

    // In real life, you'd:
    // 1) POST to a "payments" collection or update an "allocations" record
    // 2) Refresh the data, or update state:
    //    setPaymentHistory(...)
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

  // Combine first+last name for display
  const fullName = `${resident.first_name} ${resident.last_name}`.trim();

  /**
 * Calculate age from date_of_birth
 * @param {string} dateOfBirth - The date of birth in ISO format (YYYY-MM-DD or similar).
 * @returns {number} Age in years
 */
function calculateAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if the birthday hasn't occurred yet this year
  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!isBirthdayPassed) {
    age--;
  }

  return age;
}


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          {/* We'll leave the image for later, as you requested, so let's hide it for now
              or use a placeholder if you'd like. */}
          {/* <img
            src={...some url...}
            alt={fullName}
            className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
          /> */}
          
          <h2 className="text-2xl font-bold text-gray-800">{fullName || 'No Name'}</h2>
          <div className="mt-4 space-y-2">
            {/* Age */}
            {resident.date_of_birth && (
              <div className="flex items-center justify-center">
                <User className="mr-2 text-gray-500" />
                <span>{calculateAge(resident.date_of_birth)} years old</span>
              </div>
            )}

            {/* Current Room */}
            <div className="flex items-center justify-center">
              <Home className="mr-2 text-gray-500" />
              {currentRoom
                ? <span>Room {currentRoom}</span>
                : <span>No active room</span>
              }
            </div>

            {/* Occupancy Start => not in your schema,
                so we might show date_of_birth or created date for now. */}
            <div className="flex items-center justify-center">
              <Calendar className="mr-2 text-gray-500" />
              <span>
                Occupying since {resident.created?.split(' ')[0] || 'N/A'}
              </span>
            </div>

            {/* # of persons in room */}
            <div className="flex items-center justify-center">
              <CreditCard className="mr-2 text-gray-500" />
              <span>
                {resident.number_of_persons_living_in || 1} person(s) in room
              </span>
            </div>
          </div>
        </div>

        {/* Payment History Graph */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Monthly Payment History</h3>
          </div>
          <LineChart
            width={600}
            height={300}
            data={paymentHistory}
            className="mx-auto"
          >
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

        {/* Previous Rooms (from allocations) */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Previous Rooms</h3>
          {previousRooms.length > 0 ? (
            <ul className="space-y-2">
              {previousRooms.map((room, idx) => (
                <li
                  key={`${room}-${idx}`}
                  className="bg-gray-100 px-4 py-2 rounded-md flex justify-between items-center"
                >
                  <span>Room {room}</span>
                  <span className="text-sm text-gray-500">
                    {idx === 0 ? 'Most Recent' : `Previous ${idx + 1}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No previous rooms found.</p>
          )}
        </div>

        {/* Paid and Unpaid Months */}
        <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
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
              {allMonths.map((month) => (
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
                  {paidMonths.map((month) => (
                    <MonthItem
                      key={month}
                      month={month}
                      isPaid={true}
                    />
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Unpaid Months</h4>
                <ul className="space-y-2">
                  {unpaidMonths.map((month) => (
                    <MonthItem
                      key={month}
                      month={month}
                      isPaid={false}
                    />
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
