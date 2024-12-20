import { useState, useEffect } from 'react';
import { getResidentsURL, getRoomsURL } from '../utils/api';

const useFetchStats = () => {
    const [statsData, setStatsData] = useState({
        totalResidents: 0,
        occupiedRooms: 0,
        vacantRooms: 0,
        newResidentsThisMonth: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // const token = localStorage.getItem('authToken'); // Removed token retrieval
                const headers = {}; // No Authorization header

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();
                const monthStart = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;

                const [residentsRes, occupiedRes, vacantRes, newResidentsRes] = await Promise.all([
                    fetch(getResidentsURL(), { headers }),
                    fetch(`${getRoomsURL()}?filter=${encodeURIComponent('Status="occupied"')}`, { headers }),
                    fetch(`${getRoomsURL()}?filter=${encodeURIComponent('Status="available"')}`, { headers }),
                    fetch(`${getResidentsURL()}?filter=${encodeURIComponent(`created >= '${monthStart}'`)}`, { headers })
                ]);

                const newStatsData = { ...statsData };
                const errorMessages = [];

                if (residentsRes.ok) {
                    const residentsData = await residentsRes.json();
                    newStatsData.totalResidents = residentsData.total;
                } else {
                    errorMessages.push(`Failed to fetch total residents: ${residentsRes.statusText}`);
                }

                if (occupiedRes.ok) {
                    const occupiedData = await occupiedRes.json();
                    newStatsData.occupiedRooms = occupiedData.total;
                } else {
                    errorMessages.push(`Failed to fetch occupied rooms: ${occupiedRes.statusText}`);
                }

                if (vacantRes.ok) {
                    const vacantData = await vacantRes.json();
                    newStatsData.vacantRooms = vacantData.total;
                } else {
                    errorMessages.push(`Failed to fetch vacant rooms: ${vacantRes.statusText}`);
                }

                if (newResidentsRes.ok) {
                    const newResidentsData = await newResidentsRes.json();
                    newStatsData.newResidentsThisMonth = newResidentsData.total;
                } else {
                    errorMessages.push(`Failed to fetch new residents this month: ${newResidentsRes.statusText}`);
                }

                setStatsData(newStatsData);

                if (errorMessages.length > 0) {
                    setError(errorMessages.join('\n'));
                }

            } catch (err) {
                setError(`Network error while fetching statistics: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []); // Empty dependency array ensures this runs once on mount

    return { statsData, loading, error };
};

export default useFetchStats;