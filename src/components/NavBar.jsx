import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DropMenu from "./DropMenu";

const NavBar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = {
        residents: [
            { label: "Add Resident", href: "/residents/add" },
            { label: "Resident List", href: "/residents/list" },
            { label: "Resident Management", href: "/residents/manage" }
        ],
        rooms: [
            { label: "Room Allocation", href: "/rooms/allocate/-1" },
            { label: "Vacant Rooms", href: "/rooms/vacant" }
        ],
        reports: [
            { label: "Occupancy Report", href: "/reports/occupancy" },
            { label: "Financial Report", href: "/reports/financial" },
            { label: "Maintenance Report", href: "/reports/maintenance" }
        ]
    };

    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
                        >
                            ResidManage
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={toggleMobileMenu}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <Link
                            to="/"
                            className={`px-3 py-2 text-sm font-medium ${
                                location.pathname === '/' 
                                    ? 'text-indigo-600 bg-indigo-50' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            } rounded-md`}
                        >
                            Dashboard
                        </Link>

                        <DropMenu title="Residents" items={menuItems.residents} />
                        <DropMenu title="Rooms" items={menuItems.rooms} />
                        <DropMenu title="Reports" items={menuItems.reports} />

                        <Link
                            to="/settings"
                            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Settings
                        </Link>

                        <Link
                            to="/login"
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                to="/"
                                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                            >
                                Dashboard
                            </Link>
                            {/* Repeat for other menu items */}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;