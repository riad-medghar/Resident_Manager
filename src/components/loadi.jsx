import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';

const BeautifulRealEstateLoader = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Après la transition (500ms), on notifie la fin du chargement
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 500);
        }, 100);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-600 via-red-500 to-pink-700 transition-opacity duration-500 ${
                fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <FaHome className="text-white text-8xl animate-[spin_3s_linear_infinite]" />
            <p className="mt-4 text-white text-2xl font-bold animate-pulse">
                Bienvenue dans votre univers immobilier...
            </p>
        </div>
    );
};

export default BeautifulRealEstateLoader;