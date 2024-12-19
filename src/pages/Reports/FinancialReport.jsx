
import React from "react";
import Histogram from "../../components/Histogram";

const FinancialReport = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [1000, 1200, 1500, 1400, 1600, 1300, 1450, 1500, 1350, 1400, 1550, 1700]; // Example data

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Financial Report</h1>

            {/* Summary Section */}
            <div className="mb-4 bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <p>Total Revenue: $15,000</p>
                <p>Total Expenses: $10,000</p>
                <p>Net Profit: $5,000</p>
            </div>

            {/* Filters */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">Filter by Date Range</label>
                <input type="date" className="border p-2 rounded-md mr-2" />
                <input type="date" className="border p-2 rounded-md" />
                <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Apply Filters
                </button>
            </div>

            <div className="w-full md:w-1/2 mx-auto">
                <Histogram title="Monthly Maintenance Activities" labels={labels} data={data} />
            </div>

            {/* Data Table */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Detailed Data</h2>
                <table className="table-auto w-full bg-white shadow-md rounded-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">2024-01-01</td>
                            <td className="border px-4 py-2">Room Booking</td>
                            <td className="border px-4 py-2">$500</td>
                            <td className="border px-4 py-2">Income</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialReport;