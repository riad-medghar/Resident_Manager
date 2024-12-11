import React from "react";
import DropMenu from "./DropMenu";
const NavBar = () => {
    const menuItems = {
        residents:[
            { label: "Add Resident", href:"/residents/add" },
            { label: "Resident List", href:"/residents/list" },
            { label: "Resident Management", href:"/residents/manage" }
        ],
        rooms:[
            { label: "Room Allocation", href:"/rooms/allocation" },
            { label: "Room Types", href:"/rooms/types" },
            { label: "Vacant Rooms", href:"/rooms/vacant" }
        ],
        reports:[
            { label: "Occupancy Report", href:"/reports/occupancy" },
            { label: "Financial Report", href:"/reports/financial" },
            { label: "Maintenace Report", href:"/reports/maintenance" }
        ]
    };
    return(
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800">ResidManage</span>
                    </div>
                    {/* Navigation Items */}
                    <div className="flex space-x-4 items-center">
                        {/* Regular Buttons */}
                        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                            Dashboard
                        </button>
                        {/* DropDowns */}
                        <DropMenu title="Residents" items={menuItems.residents} />
                        <DropMenu title="Rooms" items={menuItems.rooms} />
                        <DropMenu title="Reports" items={menuItems.reports} />
                        {/* Settings */}
                        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                            Settings
                        </button>
                        {/* User Profile */}
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none
                        docus:ring-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default NavBar;