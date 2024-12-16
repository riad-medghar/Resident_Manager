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
            const apiUrl = 'http://127.0.0.1:8090'; // Remove /api since it's part of the endpoint
            const response = await invoke('add_resident', { residentData, apiUrl });
            setSuccess(true);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to add resident');
        } finally {
            setLoading(false);
        }
    };

    return { addResident, loading, error, success };
};

export default useAddResident;
