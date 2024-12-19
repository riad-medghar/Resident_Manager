import React, { useState } from "react";
import Histogram from "../../components/Histogram";

const FinancialReport = () => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [1000, 1200, 1500, 1400, 1600, 1300, 1450, 1500, 1350, 1400, 1550, 1700]; // Example data

    const mockTableData = [
        { date: "2024-01-01", description: "Room Booking", amount: "$500", type: "Income" },
        { date: "2024-01-05", description: "Maintenance", amount: "$200", type: "Expense" },
        { date: "2024-01-10", description: "Room Booking", amount: "$700", type: "Income" },
    ];

    const paymentModes = ["Cash", "Credit Card", "Bank Transfer", "Online Payment"];
    const expenseCategories = ["Maintenance", "Utilities", "Salaries", "Miscellaneous"];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Financial Report</h1>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Export Report
                    </button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-green-600">$15,000</div>
                        <p className="text-gray-500">total revenue</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-red-600">$10,000</div>
                        <p className="text-gray-500">total expenses</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-700">Net Profit</h3>
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-blue-600">$5,000</div>
                        <p className="text-gray-500">net profit</p>
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
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Financial Trend</h3>
                    <Histogram title="" labels={labels} data={data} />
                </div>
            </div>

            {/* Payment Modes Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Modes</h3>
                <ul className="list-disc list-inside">
                    {paymentModes.map((mode, index) => (
                        <li key={index} className="text-gray-700">{mode}</li>
                    ))}
                </ul>
            </div>

            {/* Outstanding Payments Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Outstanding Payments</h3>
                <p className="text-gray-700">Track outstanding payments here...</p>
            </div>

            {/* Expense Categorization Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Categorization</h3>
                <ul className="list-disc list-inside">
                    {expenseCategories.map((category, index) => (
                        <li key={index} className="text-gray-700">{category}</li>
                    ))}
                </ul>
            </div>

            {/* Per-Resident Payment History Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Per-Resident Payment History</h3>
                <p className="text-gray-700">View payment history for each resident here...</p>
            </div>

            {/* Receipt Generation Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Receipt Generation</h3>
                <p className="text-gray-700">Generate receipts for payments here...</p>
            </div>

            {/* Detailed Profit/Loss Analysis Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detailed Profit/Loss Analysis</h3>
                <p className="text-gray-700">Analyze profit and loss in detail here...</p>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Detailed Financial Data</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockTableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            row.type === 'Income' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {row.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;