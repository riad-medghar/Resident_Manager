import React, { useState } from "react";
import Histogram from "../../components/Histogram";

const MaintenanceReport = () => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [5, 8, 4, 6, 7, 3, 5, 6, 4, 7, 8, 9]; // Example data

    const mockTableData = [
        { taskId: "1", description: "Fix Air Conditioner", status: "Completed", assignedTo: "John Doe", priority: "High", cost: "$200", category: "HVAC", unit: "101", expectedResolution: "2024-01-10" },
        { taskId: "2", description: "Repair Plumbing", status: "Pending", assignedTo: "Jane Smith", priority: "Medium", cost: "$150", category: "Plumbing", unit: "102", expectedResolution: "2024-01-15" },
        { taskId: "3", description: "Replace Light Bulbs", status: "Completed", assignedTo: "Mike Johnson", priority: "Low", cost: "$50", category: "Electrical", unit: "103", expectedResolution: "2024-01-05" },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Maintenance Report</h1>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Export Report
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Total Tasks Completed</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-green-600">60</div>
                        <p className="text-gray-500">tasks completed</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Total Pending Tasks</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-red-600">10</div>
                        <p className="text-gray-500">tasks pending</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Average Resolution Time</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-blue-600">2 days</div>
                        <p className="text-gray-500">average time</p>
                    </div>
                </div>
            </div>

            {/* Filters and Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Apply Filters
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Maintenance Activities</h3>
                    <Histogram title="" labels={labels} data={data} />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Detailed Task Status</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Resolution</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockTableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.taskId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            row.status === 'Completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.assignedTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.priority}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.expectedResolution}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceReport;