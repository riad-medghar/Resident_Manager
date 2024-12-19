import React from "react";
import Histogram from "../../components/Histogram";

const MaintenanceReport = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [5, 8, 4, 6, 7, 3, 5, 6, 4, 7, 8, 9]; // Example data

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Maintenance Report</h1>

            {/* Summary Section */}
            <div className="mb-4 bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <p>Total Tasks Completed: 60</p>
                <p>Total Pending Tasks: 10</p>
                <p>Average Resolution Time: 2 days</p>
            </div>

            {/* Filters */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">Filter by Date Range</label>
                <div className="flex items-center">
                    <input type="date" className="border p-2 rounded-md mr-2" />
                    <input type="date" className="border p-2 rounded-md" />
                    <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Apply Filters
                    </button>
                </div>
            </div>

            <div className="w-full md:w-1/2 mx-auto mb-6">
                <Histogram title="Monthly Maintenance Activities" labels={labels} data={data} />
            </div>

            {/* Data Table */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Detailed Data</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full bg-white shadow-md rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Task ID</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-2">1</td>
                                <td className="border px-4 py-2">Fix Air Conditioner</td>
                                <td className="border px-4 py-2">Completed</td>
                                <td className="border px-4 py-2">John Doe</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-2">2</td>
                                <td className="border px-4 py-2">Repair Plumbing</td>
                                <td className="border px-4 py-2">Pending</td>
                                <td className="border px-4 py-2">Jane Smith</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-2">3</td>
                                <td className="border px-4 py-2">Replace Light Bulbs</td>
                                <td className="border px-4 py-2">Completed</td>
                                <td className="border px-4 py-2">Mike Johnson</td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceReport;