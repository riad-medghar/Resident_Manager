import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, Filter, ArrowUpDown } from 'lucide-react';
import useAllocations from '../../hooks/useAllocations';



const ResidentsList = () => {
  const navigate = useNavigate();
  const { allocations, loading } = useAllocations();

  // Search & sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  /**
   * Step 1: Transform each allocation item into a "display" object:
   * {
   *   id: allocation.id,
   *   residentId: allocation.expand?.resident_id?.id,
   *   firstName: allocation.expand?.resident_id?.first_name,
   *   lastName: allocation.expand?.resident_id?.last_name,
   *   roomNumber: allocation.expand?.room_id?.room_number,
   *   paymentDate: allocation.payment_date (not implemented yet => show "—"),
   *   paymentStatus: allocation.payment_status (not implemented yet => show "—"),
   * }
   */
  const displayData = useMemo(() => {
    return allocations.map((alloc) => ({
      id: alloc.id,
      residentId: alloc.expand?.resident_id?.id || null,
      firstName: alloc.expand?.resident_id?.first_name || '',
      lastName: alloc.expand?.resident_id?.last_name || '',
      roomNumber: alloc.expand?.room_id?.room_number || '',
      // Payment fields (not yet in PB? => show placeholders)
      paymentDate: alloc.payment_date || '', 
      paymentStatus: alloc.payment_status || '', 
    }));
  }, [allocations]);

  
/**
   * Step 2: Filtering by search term
   * We combine firstName + lastName for searching, plus roomNumber, plus paymentStatus.
   */
  const filtered = useMemo(() => {
    return displayData.filter((item) => {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        item.roomNumber.includes(searchTerm) ||
        item.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, displayData]);

  /**
   * Step 3: Sorting
   * We can allow sorting by "firstName", "roomNumber", "paymentDate", or "paymentStatus."
   */
  const sorted = useMemo(() => {
    let sortable = [...filtered];
    if (sortConfig.key !== null) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filtered, sortConfig]);

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // "View" button => navigate to a dedicated resident details page
  const handleViewResident = (residentId) => {
    if (!residentId) {
      alert('No residentId found for this record!');
      return;
    }
    navigate(`/residents/${residentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3" /> Residents List
        </h1>

        <div className="flex items-center space-x-4">
          {/* Search box */}
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

          {/* Add Resident button */}
          <button 
            onClick={() => navigate('/residents/add')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Resident
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {/* Name */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              {/* Room */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('roomNumber')}
              >
                <div className="flex items-center">
                  Room
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              {/* Payment Date */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('paymentDate')}
              >
                <div className="flex items-center">
                  Payment Date
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              {/* Payment Status */}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('paymentStatus')}
              >
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 text-gray-400" size={16} />
                </div>
              </th>
              {/* Actions */}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sorted.map((item) => {
              const fullName = `${item.firstName} ${item.lastName}`.trim();

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {fullName || 'Unnamed Resident'}
                  </td>
                  {/* Room */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {item.roomNumber ? `Room ${item.roomNumber}` : '—'}
                  </td>
                  {/* Payment Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {item.paymentDate || '—'}
                  </td>
                  {/* Payment Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.paymentStatus ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.paymentStatus.toLowerCase() === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewResident(item.residentId)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                    >
                      <Eye className="mr-2" size={20} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Loading state or empty state */}
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading residents...
          </div>
        )}
        {!loading && sorted.length === 0 && (
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