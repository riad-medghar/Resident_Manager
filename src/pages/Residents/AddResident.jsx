import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Save, Clock } from 'lucide-react';

const AddResident = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        roomNumber: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        medicalNotes: '',
        duration: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested emergency contact fields
        if (name.startsWith('emergencyContact.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // TODO: Implement actual submission logic
            console.log('Form submitted:', formData);
            alert('Resident added successfully!');
        } else {
            console.log('Form has errors');
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
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.firstName 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
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
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.lastName 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
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
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.email 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.phone 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
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
                            <input
                                type="text"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleInputChange}
                                placeholder="Enter room number"
                                className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                                    errors.roomNumber 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            {errors.roomNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Duration os stay (in months)
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
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
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
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
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
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
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleInputChange}
                                placeholder="Emergency contact phone"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Medical Notes */}
                <div className="mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Medical Notes
                    </label>
                    <textarea
                        name="medicalNotes"
                        value={formData.medicalNotes}
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
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <Save className="mr-2" /> Save Resident
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResident;
