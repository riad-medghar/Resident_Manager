import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, Filter, ArrowUpDown } from 'lucide-react';

// Mock data - in a real application, this would come from an API
const residentData = [
  {
    id: 1,
    name: 'John Doe',
    roomNumber: '101',
    paymentDate: '2024-01-15',
    paymentStatus: 'Paid',
    profileImage: '/api/placeholder/100/100'
  },
  {
    id: 2,
    name: 'Jane Smith',
    roomNumber: '202',
    paymentDate: '2024-01-20',
    paymentStatus: 'Pending',
    profileImage: '/api/placeholder/100/100'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    roomNumber: '305',
    paymentDate: '2024-01-25',
    paymentStatus: 'Paid',
    profileImage: '/api/placeholder/100/100'
  }
];

const ResidentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const navigate = useNavigate();

  // Advanced filtering with multiple criteria
  const filteredResidents = useMemo(() => {
    return residentData.filter(resident => 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.roomNumber.includes(searchTerm) ||
      resident.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Sorting functionality
  const sortedResidents = useMemo(() => {
    let sortableResidents = [...filteredResidents];
    if (sortConfig.key !== null) {
      sortableResidents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableResidents;
  }, [filteredResidents, sortConfig]);

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleViewResident = (residentId) => {
    navigate(`/residents/${residentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3" /> Residents List
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search residents..." 
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
          <button 
            onClick={() => navigate('/residents/add')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Resident
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('roomNumber')}
              >
                <div className="flex items-center">
                  Room
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('paymentDate')}
              >
                <div className="flex items-center">
                  Payment Date
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('paymentStatus')}
              >
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResidents.map((resident) => (
              <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <img 
                    src={resident.profileImage} 
                    alt={resident.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span className="font-medium text-gray-900">{resident.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  Room {resident.roomNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {resident.paymentDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    resident.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {resident.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => handleViewResident(resident.id)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                  >
                    <Eye className="mr-2" size={20} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {sortedResidents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <Users className="mx-auto mb-4 text-gray-300" size={48} />
            <p>No residents found</p>
            <p className="text-sm">Try adjusting your search or add a new resident</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentsList;