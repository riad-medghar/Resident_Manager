import React, { useEffect, useState } from 'react';
import pb from '../pocketsdk';

const AllocationSelect = ({ label, value, error, onChange }) => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const { items } = await pb.collection('allocations').getList(1, 200, {
          filter: 'status = "active"',
          expand: 'resident_id,room_id'
        });
        setAllocations(items);
      } catch (err) {
        console.error('Error fetching allocations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  const getDisplayText = (allocation) => {
    const resident = allocation.expand?.resident_id;
    const room = allocation.expand?.room_id;
    return `Room ${room?.room_number} - ${resident?.first_name} ${resident?.last_name}`;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        disabled={loading}
      >
        <option value="">Select Allocation</option>
        {allocations.map((alloc) => (
          <option key={alloc.id} value={alloc.id}>
            {getDisplayText(alloc)}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {loading && (
        <p className="text-gray-500 text-sm mt-1">Loading allocations...</p>
      )}
    </div>
  );
};

export default AllocationSelect;