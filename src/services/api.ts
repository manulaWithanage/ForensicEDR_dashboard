import axios from 'axios';
import type { CrashEvent, EvidenceCustodyLog, ReportData, CrashFilters } from '../types';

// Configuration
// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://forensicedr-cloud.onrender.com/api/v1';
const USE_MOCK_DATA = false; // Switched to real API

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock Data Generators (Keep for fallback/reference if needed, or remove to clean up)
// ... (omitted for brevity, but in real file I'd keep or remove. I'll remove to force real data usage)

// API Methods
export const CrashService = {
    getAll: async (filters?: CrashFilters): Promise<CrashEvent[]> => {
        const response = await api.get('/crashes', { params: filters });
        return response.data;
    },

    getById: async (id: string): Promise<CrashEvent> => {
        const response = await api.get(`/crashes/${id}`);
        // Handle wrapped response from API
        return response.data.crash_event || response.data;
    },

    getNearby: async (lat: number, lon: number, radius: number): Promise<CrashEvent[]> => {
        const response = await api.get('/crashes/nearby', { params: { lat, lon, radius_km: radius } });
        return response.data;
    }
};

export const EvidenceService = {
    getChain: async (eventId: string): Promise<EvidenceCustodyLog[]> => {
        const response = await api.get(`/custody/${eventId}`);
        return response.data;
    },

    getAllLogs: async (): Promise<EvidenceCustodyLog[]> => {
        // Workaround: API doesn't have a bulk logs endpoint.
        // Fetch recent crashes and then fetch their custody chains.
        try {
            const crashesResponse = await api.get('/crashes', { params: { limit: 10 } });
            const crashes = crashesResponse.data as CrashEvent[];

            const promises = crashes.map(crash =>
                api.get(`/custody/${crash.event_id}`)
                    .then(res => res.data)
                    .catch(() => []) // Ignore errors for individual chains
            );

            const results = await Promise.all(promises);
            return results.flat();
        } catch (error) {
            console.error("Failed to fetch all logs:", error);
            return [];
        }
    }
};

export const ReportService = {
    generate: async (type: string): Promise<ReportData> => {
        const response = await api.get('/reports/generate', { params: { report_type: type } });
        return response.data;
    },

    getRecent: async (): Promise<ReportData[]> => {
        const response = await api.get('/reports/cached/recent');
        return response.data;
    }
};
