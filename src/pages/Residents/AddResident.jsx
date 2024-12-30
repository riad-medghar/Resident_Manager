import React, { useState } from 'react';
import useResidents from '../../hooks/useResidents';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const AddResident = () => {
    const { addResident, loading, error } = useResidents();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email_address: "",
        phone_number: "",
        date_of_birth: "",
        emergency_contact_name: "",
        relationship_to_resident: "",
        emergency_contact_phone_number: "",
        medical_notes: "",
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

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
            const residentResponse = await addResident(formData);
            if (residentResponse?.id) {
                // Redirect to room allocation page with resident ID
                window.location.href = `/room-allocation/${residentResponse.id}`;
            }
        } catch (err) {
            console.error("Error saving resident:", err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <User className="mr-3" /> New Resident Registration
                    </h1>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.first_name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        placeholder="Enter first name"
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
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.last_name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        placeholder="Enter last name"
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
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email_address"
                                        value={formData.email_address}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.email_address ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        placeholder="Enter email address"
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
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                        placeholder="Enter phone number"
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
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contact</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Emergency contact name"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Relationship</label>
                                <input
                                    type="text"
                                    name="relationship_to_resident"
                                    value={formData.relationship_to_resident}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Relationship to resident"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="emergency_contact_phone_number"
                                    value={formData.emergency_contact_phone_number}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Emergency contact phone"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${
                                loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg font-semibold`}
                        >
                            {loading ? 'Saving...' : 'Continue to Room Allocation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResident;