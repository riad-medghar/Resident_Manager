import React from "react";
import Histogram from "../../components/Histogram";

const OccupancyReport = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [50, 60, 70, 80, 90, 75, 85, 95, 65, 70, 80, 90]; // Example data

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Occupancy Report</h1>

            {/* Summary Section */}
            <div className="mb-4 bg-gray-100 p-4 rounded-md shadow">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <p>Total Occupied Rooms: 85</p>
                <p>Total Vacant Rooms: 15</p>
                <p>Occupancy Rate: 85%</p>
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
                            <th className="px-4 py-2">Room</th>
                            <th className="px-4 py-2">Occupant</th>
                            <th className="px-4 py-2">Check-In</th>
                            <th className="px-4 py-2">Check-Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">101</td>
                            <td className="border px-4 py-2">John Doe</td>
                            <td className="border px-4 py-2">2024-01-01</td>
                            <td className="border px-4 py-2">2024-01-10</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OccupancyReport;