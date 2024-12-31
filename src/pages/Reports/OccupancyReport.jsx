// File: src/pages/Reports/OccupancyReport.jsx
import React, { useState, useEffect, useMemo } from "react";
import useFetchRooms from "../../hooks/useFetchRooms";
import useResidents from "../../hooks/useResidents";
import useAllocations from "../../hooks/useAllocations";
import useMonthlyOccupancy from "../../hooks/useMonthlyOccupency";
import Histogram from "../../components/Histogram"; // or wherever your chart component is

export default function OccupancyReport() {
  // 1) Load data from hooks
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    totalRooms,
    totalOccupiedRooms,
    totalAvailableRooms,
    totalReservedRooms,
    fetchRooms,
  } = useFetchRooms();

  const {
    residents,
    loading: residentsLoading,
    error: residentsError,
    fetchResidents,
  } = useResidents();

  const {
    allocations,
    loading: allocationsLoading,
    error: allocationsError,
    fetchAllocations,
  } = useAllocations();

  const { labels, data, loading, error } = useMonthlyOccupancy();

  // 2) Basic states for filtering, searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "all", floor: "all" });

  // 3) On mount, ensure we load data from all hooks
  useEffect(() => {
    fetchRooms();
    fetchResidents();
    fetchAllocations();
  }, [fetchRooms, fetchResidents, fetchAllocations]);

  // 4) Example chart data
  const chartLabels = useMemo(() => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], []);
  const chartData = useMemo(() => [50,60,70,80,90,75,85,95,65,70,80,90], []);

  // 5) Derive a simpler definition of occupancy from allocations if needed
  // For instance, an "active" allocation means a room is in use.
  // But you also have "rooms.status" like "occupied" or "reserved" for a quick approach.

  // We'll do a simple approach: Occupancy rate from rooms' perspective:
  const occupancyRate = totalRooms > 0 ? (totalOccupiedRooms / totalRooms) * 100 : 0;

  // 6) Merge Rooms & Allocations & Residents if you want a combined table
  // Example: create a "combined" list where each room includes current occupant from allocations
  const mergedData = useMemo(() => {
    // We want to see if there's an active allocation for each room, who is the occupant, etc.
    // expansions in allocations might help, or we can manually match IDs.

    // if your allocations are expanded, each item has: .expand.resident_id + .expand.room_id
    // or you can do your own matching:
    
    return rooms.map((room) => {
      // find an active allocation for that room
      const activeAlloc = allocations.find(
        (alloc) => alloc.room_id === room.id && alloc.status === "active"
      );
      // or if expanded, check .expand.room_id?.id === room.id

      // occupant name if we found an active allocation
      let occupantName = "N/A";
      if (activeAlloc) {
        // if expanded
        if (activeAlloc.expand && activeAlloc.expand.resident_id) {
          const res = activeAlloc.expand.resident_id;
          occupantName = `${res.first_name || ""} ${res.last_name || ""}`.trim() || "N/A";
        } else {
          // if not expanded, you'd match the IDs in your residents array
          // occupantName = ...
        }
      }

      return {
        ...room,
        occupant: occupantName,
        // etc.
      };
    });
  }, [rooms, allocations]);

  // 7) Filter & search the merged data if needed
  const filteredRooms = useMemo(() => {
    return mergedData.filter((r) => {
      // match status
      if (filters.status !== "all" && r.status !== filters.status) return false;
      // match floor
      if (filters.floor !== "all" && r.floor !== filters.floor) return false;
      // match search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!r.room_number.toLowerCase().includes(q) && !r.occupant.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [mergedData, filters, searchQuery]);

  // 8) Loading / error states combined
  const isLoading = roomsLoading || residentsLoading || allocationsLoading;
  const loadError = roomsError || residentsError || allocationsError;

  // 9) Render
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Occupancy Report</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Print Report
          </button>
        </div>
      </div>

      {isLoading && <p>Loading data...</p>}
      {loadError && <p className="text-red-600">Error: {loadError}</p>}

      {/* Stats Cards */}
      {!isLoading && !loadError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              {
                title: "Total Units",
                value: totalRooms,
                color: "text-gray-800",
                subtext: "All units",
              },
              {
                title: "Occupied Units",
                value: totalOccupiedRooms,
                color: "text-green-600",
                subtext: `${occupancyRate.toFixed(1)}% occupancy`,
              },
              {
                title: "Available Units",
                value: totalAvailableRooms,
                color: "text-red-600",
                subtext: "Vacant/available units",
              },
              {
                title: "Reserved Units",
                value: totalReservedRooms,
                color: "text-blue-600",
                subtext: "Upcoming move-ins",
              },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  {stat.title}
                </h3>
                <div className="mt-2">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  {stat.subtext && (
                    <p className="text-gray-500 text-sm">{stat.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Example alert for soon-expiring allocations */}
          <div className="mb-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-yellow-700">
                  3 allocations expiring within the next 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Filters + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Filters
              </h3>
              {/* Example: status + floor filters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={filters.floor}
                    onChange={(e) =>
                      setFilters({ ...filters, floor: e.target.value })
                    }
                  >
                    <option value="all">All Floors</option>
                    {[...new Set(rooms.map((r) => r.floor).filter(Boolean))].map(
                      (fl) => (
                        <option key={fl} value={fl}>
                          {fl}
                        </option>
                      )
                    )}
                  </select>
                </div>
                {/* Another search or date range if needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Room # or occupant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Occupancy Trend
              </h3>
              <Histogram title="Occupancy Trend" labels={labels} data={data} />
            </div>
          </div>

          {/* Detailed Table */}
          <DetailedOccupancyTable data={filteredRooms} />
        </>
      )}
    </div>
  );
}

/** Example sub-component for the detail table. */
function DetailedOccupancyTable({ data }) {
  // data is an array of rooms merged with occupant name, etc.
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-700">
          Detailed Unit Status
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Room
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Floor
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Occupant
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              {/* You can add more columns for start_date, end_date, etc. */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((room, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">
                  {room.room_number}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {room.room_type || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {room.floor || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {room.occupant || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      room.status === "occupied"
                        ? "bg-blue-100 text-blue-800"
                        : room.status === "available"
                        ? "bg-green-100 text-green-800"
                        : room.status === "reserved"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
