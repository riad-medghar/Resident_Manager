import React from 'react';

const ResidentStats = ({ stats }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resident Overview</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Total Residents</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalResidents}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-md">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-green-600">{stats.newResidentsThisMonth}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Evicted This Month</p>
                    <p className="text-2xl font-bold text-green-600">{stats.evictedResidentsThisMonth}</p>
                </div>

            </div>
        </div>
    );
};

export default ResidentStats;