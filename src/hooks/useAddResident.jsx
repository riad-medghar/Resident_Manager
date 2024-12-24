import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const useAddResident = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const addResident = async (residentData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Ensure the base URL matches your API server
            const apiUrl = 'http://127.0.0.1:8090';

            // Invoke the Tauri command with validated data
            const response = await invoke('add_resident', {
                resident: residentData, // Pass the residentData as-is; the backend now processes room_number as ID
                apiUrl, // Changed key to apiUrl
            });

            setSuccess(true);
            return response; // Return the response for further handling if needed
        } catch (err) {
            // Capture meaningful error messages
            setError(err.message || 'Failed to add resident');
        } finally {
            setLoading(false);
        }
    };

    return { addResident, loading, error, success };
};

export default useAddResident;
