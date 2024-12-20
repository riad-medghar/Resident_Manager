import { renderHook, act } from '@testing-library/react-hooks';
import useAddResident from './useAddResident';
import { invoke } from '@tauri-apps/api/tauri';

jest.mock('@tauri-apps/api/tauri', () => ({
    invoke: jest.fn(),
}));

describe('useAddResident', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should add resident successfully', async () => {
        const mockResponse = 'Resident added successfully';
        invoke.mockResolvedValueOnce(mockResponse);

        const { result, waitForNextUpdate } = renderHook(() => useAddResident());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);

        act(() => {
            result.current.addResident({ /* mock resident data */ });
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);

        await waitForNextUpdate();

        expect(invoke).toHaveBeenCalledWith('add_resident', {
            resident: { /* mock resident data */ },
            apiUrl: 'http://localhost:8090/api',
            // token: null, // Removed token from invoke call
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(true);
    });

    test('should handle API errors correctly', async () => {
        const mockError = 'Failed to add resident: Invalid data';
        invoke.mockRejectedValueOnce(new Error(mockError));

        const { result, waitForNextUpdate } = renderHook(() => useAddResident());

        act(() => {
            result.current.addResident({ /* mock resident data */ });
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);

        await waitForNextUpdate();

        expect(invoke).toHaveBeenCalledWith('add_resident', {
            resident: { /* mock resident data */ },
            apiUrl: 'http://localhost:8090/api',
            // token: null, // Removed token from invoke call
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(mockError);
        expect(result.current.success).toBe(false);
    });

    test('should handle network errors correctly', async () => {
        const mockError = 'Network Failure';
        invoke.mockRejectedValueOnce(new Error(mockError));

        const { result, waitForNextUpdate } = renderHook(() => useAddResident());

        act(() => {
            result.current.addResident({ /* mock resident data */ });
        });

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.success).toBe(false);

        await waitForNextUpdate();

        expect(invoke).toHaveBeenCalledWith('add_resident', {
            resident: { /* mock resident data */ },
            apiUrl: 'http://localhost:8090/api',
            // token: null, // Removed token from invoke call
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(mockError);
        expect(result.current.success).toBe(false);
    });
});

// Note: Removed references to token in test cases.