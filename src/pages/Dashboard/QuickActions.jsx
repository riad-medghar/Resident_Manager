import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();
    const actions = [
        { 
            icon: '📝', 
            title: 'New Resident', 
            description: 'Register a new resident' ,
            onClick: () => navigate('/residents/add')
        },
        { 
            icon: '🏠', 
            title: 'Assign Room', 
            description: 'Allocate room to resident' 
        },
        { 
            icon: '📊', 
            title: 'Generate Report', 
            description: 'Create occupancy report' 
        }
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-4">
                {actions.map((action, index) => (
                    <div 
                        key={index} 
                        className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition"
                        onClick={action.onClick}
                    >
                        <div className="mr-4 text-2xl">{action.icon}</div>
                        <div>
                            <p className="font-medium">{action.title}</p>
                            <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
