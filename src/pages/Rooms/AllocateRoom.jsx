import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, CreditCard, Building, User } from 'lucide-react';

// Hooks (adjust imports to match your actual file structure)
import useFetchRooms from '../../hooks/useFetchRooms';
import { useRooms } from '../../hooks/useRooms';
import useResidents from '../../hooks/useResidents';
import useAllocations from '../../hooks/useAllocations';

const AllocateRoom = () => {
  // If we navigated from AddResident, we might have a :residentId param
  const { residentId } = useParams();

  // Rooms
  const { availableRooms, fetchRooms } = useFetchRooms();
  const { updateRoomStatus } = useRooms();

  // Residents
  const { residents, fetchResidents } = useResidents();

  // Allocations
  const { addAllocation } = useAllocations();

  // For the searching logic (from HEAD):
  const [residentQuery, setResidentQuery] = useState('');
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);

  // For the form fields (from design):
  const [formData, setFormData] = useState({
    // we will fill 'resident_name' dynamically
    resident_name: '',
    // the chosen room
    room_number: '',
    // move-in/out dates
    move_in_date: '',
    move_out_date: '',
    // monthly or full
    payment_method: 'monthly',
  });

  const [errors, setErrors] = useState({});
  const [roomsLoading, setRoomsLoading] = useState(false); // optional

  // 1) Fetch data on mount
  useEffect(() => {
    fetchRooms();
    fetchResidents();
    // eslint-disable-next-line
  }, []);

  // 2) If we have a :residentId, auto-select that resident
  useEffect(() => {
    if (!residentId || !residents.length) return;

    // Find the matching resident in the store
    const match = residents.find((r) => r.id === residentId);
    if (match) {
      setSelectedResident(match);
      setFormData((prev) => ({
        ...prev,
        resident_name: `${match.first_name} ${match.last_name}`,
      }));
    }
  }, [residentId, residents]);

  // 3) Searching logic if no residentId
  useEffect(() => {
    // If we already have a selectedResident or residentId, skip searching
    if (residentId) return;
    if (!residentQuery) {
      setFilteredResidents([]);
      return;
    }
    const q = residentQuery.toLowerCase();
    const results = residents.filter((r) =>
      `${r.first_name || ''} ${r.last_name || ''}`.toLowerCase().includes(q)
    );
    setFilteredResidents(results);
  }, [residentQuery, residents, residentId]);

  // 4) Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.resident_name) newErrors.resident_name = 'Resident name is required';
    if (!formData.room_number) newErrors.room_number = 'Room selection is required';
    if (!formData.move_in_date) newErrors.move_in_date = 'Move-in date is required';
    if (!formData.move_out_date) newErrors.move_out_date = 'Move-out date is required';
    if (new Date(formData.move_out_date) <= new Date(formData.move_in_date)) {
      newErrors.move_out_date = 'Move-out date must be after move-in date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5) Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // If the user typed or auto-filled a resident name but didn't confirm
    // (selectedResident can be null if they typed something).
    // We'll handle that by either using selectedResident or searching for it.
    let finalResident = selectedResident;
    if (!finalResident) {
      // Attempt to find the resident by name
      const match = residents.find(
        (r) =>
          `${r.first_name} ${r.last_name}`.toLowerCase() ===
          formData.resident_name.toLowerCase()
      );
      if (match) {
        finalResident = match;
      }
    }

    if (!finalResident) {
      alert('Please select/confirm a valid resident.');
      return;
    }

    // Attempt to find the selected room object
    const roomObj = availableRooms.find((room) => {
      // `room_number` in your DB might be `room.number` or `room.room_number`.
      // If it’s `room_number`, adjust accordingly:
      return `${room.room_number}` === formData.room_number;
    });

    if (!roomObj) {
      alert('Selected room is invalid or not in the availableRooms list.');
      return;
    }

    try {
      setRoomsLoading(true);

      // 1) Create an allocation
      //    – mapping “move_in_date” -> “start_date,” etc.
      const newAllocation = await addAllocation({
        resident_id: finalResident.id,
        room_id: roomObj.id,
        start_date: formData.move_in_date,
        end_date: formData.move_out_date,
        status: 'active',
        notes: `Payment method: ${formData.payment_method}`,
      });

      // 2) Mark the chosen room as "occupied"
      await updateRoomStatus(roomObj.id, 'occupied');

      // 3) Optionally re-fetch rooms
      await fetchRooms();

      alert(`Success! Allocation #${newAllocation.id} created. Room is now occupied.`);

      // 4) Redirect or reset form
      // Example: go back to /residents or whatever you need:
      window.location.href = '/residents/add';
    } catch (err) {
      console.error('Error in room allocation:', err.message);
      alert('Error creating allocation.');
    } finally {
      setRoomsLoading(false);
    }
  };

  // 6) Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If user is editing the resident_name field, also update our search query
    if (name === 'resident_name') {
      setResidentQuery(value);
      // Clear selectedResident if they start typing
      if (selectedResident) setSelectedResident(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Building className="mr-3" /> Room Allocation
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Selection</h2>
            
            {/* Resident Name (with optional search dropdown) */}
            <div className="space-y-4">

              {/* Resident Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Resident Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="resident_name"
                    value={formData.resident_name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      errors.resident_name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="Enter or search resident name"
                  />
                  {errors.resident_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.resident_name}</p>
                  )}
                </div>

                {/* Show search suggestions if no :residentId */}
                {!residentId && filteredResidents.length > 0 && (
                  <ul className="border rounded mt-2 max-h-40 overflow-auto">
                    {filteredResidents.map((res) => (
                      <li
                        key={res.id}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedResident(res);
                          setFormData((prev) => ({
                            ...prev,
                            resident_name: `${res.first_name} ${res.last_name}`,
                          }));
                          setFilteredResidents([]);
                        }}
                      >
                        {res.first_name} {res.last_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Room Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Room
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      errors.room_number ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="">Select a room</option>
                    {availableRooms.map((room) => (
                      <option key={room.id} value={room.room_number}>
                        {room.room_number}
                      </option>
                    ))}
                  </select>
                  {errors.room_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.room_number}</p>
                  )}
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Move-in Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="move_in_date"
                    value={formData.move_in_date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      errors.move_in_date ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.move_in_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.move_in_date}</p>
                  )}
                </div>
              </div>

              {/* Move-out Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Move-out Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="move_out_date"
                    value={formData.move_out_date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      errors.move_out_date ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.move_out_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.move_out_date}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      errors.payment_method ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="full">Full Payment</option>
                  </select>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={roomsLoading}
              className={`${
                roomsLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg font-semibold`}
            >
              {roomsLoading ? 'Allocating...' : 'Allocate Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateRoom;
