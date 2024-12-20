import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const useFetchRooms = () => {
    const [rooms, setRooms] = useState([]); // Changed from object to flat array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = 'http://127.0.0.1:8090'; // Removed trailing slash
                const roomsByStatus = await invoke('fetch_rooms_by_status', { api_url: apiUrl }); // Ensure command name matches
                // Combine all room statuses into a single array
                const allRooms = [
                    ...roomsByStatus.available,
                    ...roomsByStatus.occupied,
                    ...roomsByStatus.maintenance, // Changed from 'under_maintenance' to match Rust struct
                ];
                setRooms(allRooms);
            } catch (err) {
                setError(err.message || 'Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return { rooms, loading, error };
};

export default useFetchRooms;
