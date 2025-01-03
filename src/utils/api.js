const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8090';

export const getResidentsURL = () => `${API_BASE_URL}/api/collections/residents/records`;
export const getRoomsURL = () => `${API_BASE_URL}/api/collections/rooms/records`;