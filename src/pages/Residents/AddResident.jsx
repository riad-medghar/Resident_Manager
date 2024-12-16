import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Clock } from 'lucide-react';
import useFetchRooms from '../../hooks/useFetchRooms';
import useAddResident from '../../hooks/useAddResident';

const AddResident = () => {
    const [formData, setFormData] = useState({
        First_Name: '',
        Last_Name: '',
        Email_Address: '',
        Phone_Number: '',
        Date_of_Birth: '',
        Former_Address: '',
        Room_Number: '',
        Emergency_Contact_Name: '',
        Relationship_to_Resident: '',
        Emergenct_Contact_Phone_Number: '',
        Medical_Notes: '',
        Duration_of_Stay: '',
        Picture: null, // Add Picture field
    });

    const [errors, setErrors] = useState({});
    const { rooms, loading: roomsLoading, error: fetchRoomsError } = useFetchRooms();
    const { addResident, loading: addLoading, success, error } = useAddResident();

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Picture' && files?.length > 0) {
            setFormData(prev => ({
                ...prev,
                Picture: files[0].name,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                updated: new Date().toISOString()
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        // Basic validation
        if (!formData.First_Name.trim()) newErrors.First_Name = 'First name is required';
        if (!formData.Last_Name.trim()) newErrors.Last_Name = 'Last name is required';
        
        if (!formData.Email_Address.trim()) {
            newErrors.Email_Address = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.Email_Address)) {
            newErrors.Email_Address = 'Email is invalid';
        }

        if (!formData.Phone_Number.trim()) {
            newErrors.Phone_Number = 'Phone number is required';
        } else if (!/^(05|06|07)\d{8}$/.test(formData.Phone_Number)) { // Updated validation regex
            newErrors.Phone_Number = 'Phone number must start with 05, 06, or 07 and have 10 digits';
        }

        if (!formData.Emergenct_Contact_Phone_Number.trim()) {
            newErrors.Emergenct_Contact_Phone_Number = 'Emergency contact phone number is required';
        } else if (!/^(05|06|07)\d{8}$/.test(formData.Emergenct_Contact_Phone_Number)) { // Updated validation regex
            newErrors.Emergenct_Contact_Phone_Number = 'Emergency contact phone number must start with 05, 06, or 07 and have 10 digits';
        }

        if (!formData.Room_Number.trim()) newErrors.Room_Number = 'Room number is required';
        if (!formData.Former_Address.trim()) newErrors.Former_Address = 'Former address is required'; // Added Former_Address validation

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const result = await addResident(formData);
            if (result.success) {
                alert('Resident added successfully!');
                // Reset form
                setFormData({
                    id: `res_${Date.now()}`,
                    First_Name: '',
                    Last_Name: '',
                    Email_Address: '',
                    Phone_Number: '',
                    Date_of_Birth: '',
                    Former_Address: '',
                    Room_Number: '',
                    Emergency_Contact_Name: '',
                    Relationship_to_Resident: '',
                    Emergenct_Contact_Phone_Number: '',
                    Medical_Notes: '',
                    Duration_of_Stay: '',
                    Picture: null,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString(),
                });
            }
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
                                name="First_Name"
                                value={formData.First_Name}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.First_Name 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.First_Name && (
                                <p className="text-red-500 text-sm mt-1">{errors.First_Name}</p>
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
                                name="Last_Name"
                                value={formData.Last_Name}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.Last_Name 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.Last_Name && (
                                <p className="text-red-500 text-sm mt-1">{errors.Last_Name}</p>
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
                                name="Email_Address"
                                value={formData.Email_Address}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.Email_Address 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.Email_Address && (
                                <p className="text-red-500 text-sm mt-1">{errors.Email_Address}</p>
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
                                name="Phone_Number"
                                value={formData.Phone_Number}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.Phone_Number 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.Phone_Number && (
                                <p className="text-red-500 text-sm mt-1">{errors.Phone_Number}</p>
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
                                name="Date_of_Birth"
                                value={formData.Date_of_Birth}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Room Number */}
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Room Number
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" />
                            <select
                                name="Room_Number"
                                value={formData.Room_Number}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.Room_Number 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            >
                                <option value="">Select a room</option>
                                {rooms.available.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.Room_Number} - {room.Type}
                                    </option>
                                ))}
                            </select>
                            {errors.Room_Number && (
                                <p className="text-red-500 text-sm mt-1">{errors.Room_Number}</p>
                            )}
                        </div>
                    </div>

                    {/* Former Address */}
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Former Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="Former_Address"
                                value={formData.Former_Address}
                                onChange={handleInputChange}
                                placeholder="Enter former address"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.Former_Address 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.Former_Address && (
                                <p className="text-red-500 text-sm mt-1">{errors.Former_Address}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Duration of Stay */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Duration of Stay (in months)
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="number"
                            name="Duration_of_Stay"
                            value={formData.Duration_of_Stay}
                            onChange={handleInputChange}
                            placeholder="Enter duration of stay"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
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
                                name="Emergency_Contact_Name"
                                value={formData.Emergency_Contact_Name}
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
                            <select
                                name="Relationship_to_Resident"
                                value={formData.Relationship_to_Resident}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            >
                                <option value="">Select relationship</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Friend">Friend</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Emergency Contact Phone */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    name="Emergenct_Contact_Phone_Number"
                                    value={formData.Emergenct_Contact_Phone_Number}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                        errors.Emergenct_Contact_Phone_Number 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-indigo-500'
                                    }`}
                                />
                                {errors.Emergenct_Contact_Phone_Number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Emergenct_Contact_Phone_Number}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Notes */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Medical Notes
                    </label>
                    <textarea
                        name="Medical_Notes"
                        value={formData.Medical_Notes}
                        onChange={handleInputChange}
                        placeholder="Enter any important medical information"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    />
                </div>

                {/* Add Picture Upload */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Profile Picture
                    </label>
                    <div className="relative">
                        {/* You can add an icon here if desired */}
                        <input
                            type="file"
                            name="Picture"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                        />
                        {errors.Picture && (
                            <p className="text-red-500 text-sm mt-1">{errors.Picture}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                        disabled={addLoading}
                    >
                        <Save className="mr-2" /> Save Resident
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
}
export default AddResident;


