import React, { useState } from 'react';
import useResidents from '../../hooks/useResidents';
import { useFetchRooms, useRooms } from '../../hooks/useRooms';
import { User, Mail, Phone, MapPin, Calendar, Save, Clock } from 'lucide-react';

const AddResident = () => {
    const { addResident, loading, successMessage, error } = useResidents();
    const { availableRooms, setRooms, loading: roomsLoading, error: roomsError } = useFetchRooms();
    const { error: updateError, updateRoomStatus} = useRooms(roomsError, setRooms);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email_address: "",
        phone_number: "",
        date_of_birth: "",
        room_number: "",
        move_in_date: "",
        move_out_date: "",
        emergency_contact_name: "",
        relationship_to_resident: "",
        emergency_contact_phone_number: "",
        medical_notes: "",
        former_address: "",
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'duration_of_stay' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic validation for required fields
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email_address.trim()) {
            newErrors.email_address = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
            newErrors.email_address = 'Invalid email address';
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Invalid phone number';
        }
        if (!formData.room_number.trim()) newErrors.room_number = 'Room number is required';
        if (!formData.move_in_date) newErrors.move_in_date = 'move in date is required';
        if (!formData.move_out_date) newErrors.move_out_date = 'move out date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        if (!validateForm()) {
            return;
        }
    
        try {
            //console.log("Adding resident with data:", formData);
            const residentResponse = await addResident(formData);
    
            if (!residentResponse || !residentResponse.id) {
                console.error("Failed to add resident.");
                throw new Error("Resident creation failed.");
            }
    
            //console.log("Resident added successfully:", residentResponse);
    
            //console.log("Updating room status for room:", formData.room_number);
            const roomUpdateResponse = await updateRoomStatus(formData.room_number, "reserved");
    
            if (!roomUpdateResponse) {
                console.error("Room status update failed with no response.");
                throw new Error("Room status update failed.");
            }
    
            //console.log("Room status updated successfully:", roomUpdateResponse);
    
            // Reset the form only if all operations are successful
            setFormData({
                first_name: "",
                last_name: "",
                email_address: "",
                phone_number: "",
                date_of_birth: "",
                room_number: "",
                move_in_date: "",
                move_out_date: "",
                emergency_contact_name: "",
                relationship_to_resident: "",
                emergency_contact_phone_number: "",
                medical_notes: "",
                former_address: "",
            });
        } catch (err) {
            console.error("Error saving resident:", err.message);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                <User className="mr-3 text-indigo-600" /> Add New Resident
            </h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                {/* Personal Information Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.first_name 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Last Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.last_name 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email_address"
                                value={formData.email_address}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.email_address 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.email_address && (
                                <p className="text-red-500 text-sm mt-1">{errors.email_address}</p>
                            )}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.phone_number 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                            )}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Date of Birth
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Room Number */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Room Number
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" />
                            <select
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-md ${
                                    errors.room_number ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a room for reservation</option>
                                {availableRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.room_number}
                                </option>
                                ))}
                            </select>
                            {errors.room_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.room_number}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* move in-out */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Move In Date
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="date"
                            name="move_in_date"
                            value={formData.move_in_date}
                            onChange={handleInputChange}
                            placeholder="Enter duration of stay"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                        {errors.move_in_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.move_in_date}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Move Out Date
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="date"
                            name="move_out_date"
                            value={formData.move_out_date}
                            onChange={handleInputChange}
                            placeholder="Enter duration of stay"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                        {errors.move_out_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.move_out_date}</p>
                        )}
                    </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="mt-6 border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Emergency Contact
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Emergency Contact Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleInputChange}
                                placeholder="Emergency contact name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>

                        {/* Emergency Contact Relationship */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Relationship
                            </label>
                            <input
                                type="text"
                                name="relationship_to_resident"
                                value={formData.relationship_to_resident}
                                onChange={handleInputChange}
                                placeholder="Relationship to resident"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>

                        {/* Emergency Contact Phone */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="emergency_contact_phone_number"
                                value={formData.emergency_contact_phone_number}
                                onChange={handleInputChange}
                                placeholder="Emergency contact phone"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    errors.emergency_contact_phone_number 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.emergency_contact_phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_phone_number}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Medical Notes */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Medical Notes
                    </label>
                    <textarea
                        name="medical_notes"
                        value={formData.medical_notes}
                        onChange={handleInputChange}
                        placeholder="Enter any important medical information"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || roomsLoading}
                        className={`${ loading || roomsLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700' } text-white px-6 py-2 rounded-md transition-colors flex items-center`}>
                        {loading || roomsLoading ? 'Saving... :3' : <><Save className="mr-2" /> Save Resident</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResident;
