
import { renderHook, act } from '@testing-library/react-hooks';
import useFetchStats from './useFetchStats';

global.fetch = jest.fn();

describe('useFetchStats', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('should fetch and set stats data correctly', async () => {
        const mockResponses = [
            { total: 100 }, // totalResidents
            { total: 60 },  // occupiedRooms
            { total: 40 },  // vacantRooms
            { total: 10 }   // newResidentsThisMonth
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponses[0]),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponses[1]),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponses[2]),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponses[3]),
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useFetchStats());

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.statsData).toEqual({
            totalResidents: 100,
            occupiedRooms: 60,
            vacantRooms: 40,
            newResidentsThisMonth: 10,
        });
    });

    test('should handle API errors correctly', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Internal Server Error',
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Service Unavailable',
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Not Found',
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Bad Request',
            })
        );

        const { result, waitForNextUpdate } = renderHook(() => useFetchStats());

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.statsData).toEqual({
            totalResidents: 0,
            occupiedRooms: 0,
            vacantRooms: 0,
            newResidentsThisMonth: 0,
        });
        expect(result.current.error).toBe(
            'Failed to fetch total residents: Internal Server Error\n' +
            'Failed to fetch occupied rooms: Service Unavailable\n' +
            'Failed to fetch vacant rooms: Not Found\n' +
            'Failed to fetch new residents this month: Bad Request'
        );
    });

    test('should handle network errors correctly', async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Failure')));

        const { result, waitForNextUpdate } = renderHook(() => useFetchStats());

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.statsData).toEqual({
            totalResidents: 0,
            occupiedRooms: 0,
            vacantRooms: 0,
            newResidentsThisMonth: 0,
        });
        expect(result.current.error).toBe('Network error while fetching statistics: Network Failure');
    });
});