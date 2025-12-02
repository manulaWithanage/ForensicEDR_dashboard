import { useQuery } from '@tanstack/react-query';
import { CrashService, ReportService } from '../services/api';
import type { CrashFilters } from '../types';

export const useCrashes = (filters?: CrashFilters) => {
    return useQuery({
        queryKey: ['crashes', filters],
        queryFn: () => CrashService.getAll(filters),
    });
};

export const useCrash = (id: string) => {
    return useQuery({
        queryKey: ['crash', id],
        queryFn: () => CrashService.getById(id),
        enabled: !!id,
    });
};

export const useRecentReport = (type: string) => {
    return useQuery({
        queryKey: ['report', type],
        queryFn: async () => {
            // First try to get recent cached reports
            const recent = await ReportService.getRecent();
            const found = recent.find(r => r.report_type === type);
            if (found) return found;

            // If not found, generate new one
            return ReportService.generate(type);
        },
    });
};
