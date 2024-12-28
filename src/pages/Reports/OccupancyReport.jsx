import React, { useState, useEffect } from 'react';
import Histogram from "../../components/Histogram";
import { useFetchRooms } from '../../hooks/useRooms';
import useResidents from '../../hooks/useResidents';


const OccupancyReport = () => {

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [50, 60, 70, 80, 90, 75, 85, 95, 65, 70, 80, 90];

    const {
        rooms,
        loading: roomsLoading,
        error: roomsError,
        fetchRooms,
        totalAvailableRooms,
        totalOccupiedRooms,
        totalReservedRooms,
        totalRooms,
    } = useFetchRooms();

    const {
        residents,
        loading: residentsLoading,
        error: residentsError,
        fetchResidents,
        totalResidents,
    } = useResidents();

    const [filters, setFilters] = useState({ 
        unitType: 'all',
        status: 'all',
        floor: 'all'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const unitTypes = [...new Set(rooms.map(room => room.room_type))];
    const statusTypes = [...new Set(rooms.map(room => room.status))];
    const floors = [...new Set(rooms.map(room => room.floor))]; // Extract unique floors dynamically

    useEffect(() => {
        fetchRooms();
        fetchResidents();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    };

    // Merge rooms and residents data for enhanced reporting
    const mergedData = rooms.map((room) => {
        const matchingResident = residents.find((resident) => resident.room_number === room.id);

        return {
            ...room,
            occupant: matchingResident?.first_name|| "N/A",
            check_in: formatDate(matchingResident?.move_in_date),
            check_out: formatDate(matchingResident?.move_out_date),
        };
    });

    // Apply filters and search
    const filteredData = mergedData.filter((room) => {
        const matchesType = filters.unitType === 'all' || room.room_type === filters.unitType;
        const matchesStatus = filters.status === 'all' || room.status === filters.status;
        const matchesFloor = filters.floor === 'all' || room.floor === filters.floor;
        const matchesSearch =
            searchQuery === '' ||
            room.room_number.includes(searchQuery) ||
            room.occupant.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesStatus && matchesFloor && matchesSearch;
    });

    // Example expanded mock data
    const mockTableData = [
        {
            unit: "101",
            type: "Studio",
            floor: "1",
            occupant: "John Doe",
            checkIn: "2024-01-01",
            checkOut: "2025-01-01",
            status: "Occupied",
            leaseEnd: "2025-01-01",
            rent: "$1200",
            daysToExpiry: 30
        },
        {
            unit: "102",
            type: "1-Bedroom",
            floor: "1",
            occupant: "",
            checkIn: "",
            checkOut: "",
            status: "Vacant",
            leaseEnd: "",
            rent: "$1500",
            daysToExpiry: null
        },
        {
            unit: "203",
            type: "2-Bedroom",
            floor: "2",
            occupant: "Jane Smith",
            checkIn: "2023-06-01",
            checkOut: "2024-06-01",
            status: "Reserved",
            leaseEnd: "2024-06-01",
            rent: "$2000",
            daysToExpiry: 45
        }
    ];

    // Calculate statistics
    const occupancyRate = (totalOccupiedRooms / totalRooms) * 100;


    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Occupancy Report</h1>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Export Report
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Print Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                        { title: "Total Units", value: totalRooms, color: "text-gray-800", subtext: `all Units` },
                        { title: "Occupied Units", value: totalOccupiedRooms, color: "text-green-600", subtext: `${(occupancyRate).toFixed(1)}% occupied` },
                        { title: "Available Units", value: totalAvailableRooms, color: "text-red-600", subtext: `available units` },
                        { title: "Reserved Units", value: totalReservedRooms, color: "text-blue-600", subtext: `upcoming move-ins` },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                        <div className="mt-2">
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                            {stat.subtext && <p className="text-gray-500">{stat.subtext}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts Section */}
            <div className="mb-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                3 leases expiring in the next 30 days
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
                    <div className="space-y-4">
                        {[
                                { label: "Unit Type", options: unitTypes, filterKey: "unitType" },
                                { label: "Status", options: statusTypes, filterKey: "status" },
                                { label: "Floor", options: floors, filterKey: "floor" }
                            ].map((filter, idx) => (
                                <div key={idx}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{filter.label}</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={filters[filter.filterKey]}
                                    onChange={(e) => setFilters({ ...filters, [filter.filterKey]: e.target.value })}
                                >
                                    <option value="all">All {filter.label}s</option>
                                    {filter.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            />
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            />
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Apply Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Occupancy Trend</h3>
                    <Histogram title="Occupancy Trend" labels={labels} data={data} />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Detailed Unit Status</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search units or residents..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Expires</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((room, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.room_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.room_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.floor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.occupant}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            room.status === 'available' ? 'bg-green-100 text-green-800' :
                                            room.status === 'reserved' ? 'bg-red-100 text-red-800' :
                                            room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.check_in}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.check_out}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.leaseEnd}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.price} no bliz</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OccupancyReport;
