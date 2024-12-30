import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchRooms, useRooms } from '../../hooks/useRooms';
import { MapPin, Calendar, CreditCard, Building, User } from 'lucide-react';

const AllocateRoom = () => {
    const { residentId } = useParams();
    const { availableRooms, setRooms, loading: roomsLoading } = useFetchRooms();
    const { updateRoomStatus } = useRooms();
    
    const [formData, setFormData] = useState({
        resident_name: "",
        room_number: "",
        move_in_date: "",
        move_out_date: "",
        payment_method: "monthly", // or "full"
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await updateRoomStatus(formData.room_number, "reserved");
            // Additional logic to save allocation details
            window.location.href = '/residents'; // Redirect to residents list
        } catch (err) {
            console.error("Error in room allocation:", err.message);
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
                        
                        {/* Resident Name */}
                        <div className="space-y-4">
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
                                        placeholder="Enter resident name"
                                    />
                                    {errors.resident_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.resident_name}</p>
                                    )}
                                </div>
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
                                        {availableRooms.map(room => (
                                            <option key={room.id} value={room.number}>{room.number}</option>
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