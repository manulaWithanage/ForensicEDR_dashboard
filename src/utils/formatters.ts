import { format, formatDistanceToNow } from 'date-fns';

export const formatters = {
    date: (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
        } catch (e) {
            return dateString;
        }
    },

    relativeTime: (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) {
            return dateString;
        }
    },

    gForce: (value: number) => `${value.toFixed(1)} G`,

    speed: (value: number) => `${value.toFixed(1)} km/h`,

    deceleration: (value: number) => `${value.toFixed(1)} m/s²`,

    coordinates: (coords: [number, number]) => `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`,

    percentage: (value: number) => `${(value * 100).toFixed(1)}%`,
};
