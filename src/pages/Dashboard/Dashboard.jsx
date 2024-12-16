import React from "react";
import DashboardHeader from "./DashboardHeader";
import ResidentStats from "./ResidentsStats";
import RoomOccupancy from "./RoomOccupancy";
import QuickActions from "./QuickActions";
import RecentActivities from "./RecentActivities";
import useFetchStats from "../../hooks/useFetchStats"; // Adjusted import path
import LoadingSpinner from "../../components/LoadingSpinner"; // Ensure correct import path

const Dashboard = () => {
    const { statsData, loading, error } = useFetchStats();

    const recentActivities = [
        { 
            id: 1, 
            type: 'New Resident', 
            details: 'John Doe checked in', 
            timestamp: '2 hours ago' 
        },
        { 
            id: 2, 
            type: 'Room Assignment', 
            details: 'Room 205 assigned to Jane Smith', 
            timestamp: '4 hours ago' 
        },
        { 
            id: 3, 
            type: 'Maintenance', 
            details: 'Room 102 maintenance completed', 
            timestamp: '1 day ago' 
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="text-center text-red-500 whitespace-pre-line px-4">
                    {error}
                </div>
            ) : (
                <div className="container mx-auto">    
                    <DashboardHeader />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <ResidentStats stats={statsData} />
                        <RoomOccupancy occupancy={statsData} />
                        <QuickActions />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecentActivities activities={recentActivities} />
                        {/* You can add more components here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;