import React from "react";
import { Search } from "lucide-react";
const DashboardHeader = () => {

    const [searchTerm, setSearchTerm] = React.useState('');
    return(
        <div className="mb-6">
            <div className="flex justify-between items-center bg-white  shadow-sm rounded-lg p-4 border-b border-gray-100">
                <h1 className="text-3xl font-extrabold text-gary-800 tracking-tight">DashBoard</h1>
                <div className="relative flex items-center space-x-4">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                            <input
                            type="text"
                            placeholder="Search Residents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                                        rounded-xl text-gray-700 
                                        focus:outline-none focus:ring-2 focus:ring-indigo-300 
                                        focus:border-indigo-300 
                                        transition duration-200 ease-in-out 
                                        placeholder-gray-400"
                            />
                    </div>
                </div>
               {/* <div className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Add New Resident
                </div>*/}
            </div>
        </div>       
    );
};
export default DashboardHeader;
