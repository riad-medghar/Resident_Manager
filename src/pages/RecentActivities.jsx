import React from 'react';

const RecentActivities = ({ activities }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div 
                        key={activity.id} 
                        className="border-b pb-3 last:border-b-0"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{activity.type}</p>
                                <p className="text-sm text-gray-600">{activity.details}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivities;