import React, { useState, useEffect } from 'react';
import { Building, DollarSign, User, Check, X } from 'lucide-react';

const ResidentCharges = () => {
  const [selectedResident, setSelectedResident] = useState('');
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [services, setServices] = useState({
    lift: { enabled: false, price: 50 },
    cleaning: { enabled: false, price: 100 },
    parking: { enabled: false, price: 75 },
    wifi: { enabled: false, price: 30 },
    maintenance: { enabled: false, price: 150 },
    security: { enabled: false, price: 80 },
    laundry: { enabled: false, price: 45 },
    utilities: { enabled: false, price: 200 },
  });

  // Mock data for residents - replace with actual data fetch
  const residents = [
    { id: '1', name: 'John Doe', room: '101' },
    { id: '2', name: 'Jane Smith', room: '102' },
    { id: '3', name: 'Mike Johnson', room: '103' },
  ];

  const handleServiceToggle = (serviceName) => {
    setServices(prev => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        enabled: !prev[serviceName].enabled
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(services).reduce((total, service) => {
      return total + (service.enabled ? service.price : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to save charges
    const selectedServices = Object.entries(services)
      .filter(([_, service]) => service.enabled)
      .map(([name, service]) => ({
        name,
        price: service.price
      }));

    console.log('Saving charges:', {
      residentId: selectedResident,
      services: selectedServices,
      total: calculateTotal()
    });
  };

  const handleResidentInputChange = (e) => {
    const value = e.target.value;
    setSelectedResident(value);
    if (value) {
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResidents(filtered);
    } else {
      setFilteredResidents([]);
    }
  };

  const handleResidentSelect = (resident) => {
    setSelectedResident(resident.name);
    setFilteredResidents([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Building className="mr-3" /> Resident Services & Charges
          </h1>
        </div>

        <div className="p-6">
          {/* Resident Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Enter Resident Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={selectedResident}
                onChange={handleResidentInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Type resident name"
              />
              {filteredResidents.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
                  {filteredResidents.map(resident => (
                    <li
                      key={resident.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleResidentSelect(resident)}
                    >
                      {resident.name} - Room {resident.room}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(services).map(([name, service]) => (
              <div
                key={name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium capitalize">{name}</h3>
                  <p className="text-gray-600 text-sm">
                    ${service.price}/month
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {service.enabled ? (
                      <span className="text-green-600 flex items-center">
                        <Check size={16} className="mr-1" /> On
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <X size={16} className="mr-1" /> Off
                      </span>
                    )}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={service.enabled}
                      onChange={() => handleServiceToggle(name)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="text-indigo-600 mr-2" />
                <span className="text-lg font-medium">Total Monthly Charges</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">
                ${calculateTotal()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedResident}
              className={`${
                !selectedResident
                  ? 'bg-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 text-lg font-semibold`}
            >
              Save Charges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentCharges;