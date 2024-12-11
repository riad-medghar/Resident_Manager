import React, { useState } from "react";

const DropMenu = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div 
            className="relative inline-block text-left group"
        >
            <button
                onClick={toggleMenu}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
                {title}
                <svg 
                    className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div 
                className={`absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 
                            transition-all duration-300 ease-in-out 
                            ${isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
                onMouseLeave={() => setIsOpen(false)}
            >
                <div 
                    className="py-1" 
                    role="menu" 
                    aria-orientation="vertical"
                >
                    {items.map((item, index) => (
                        <a 
                            key={index} 
                            href={item.href} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                            role="menuitem"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DropMenu;