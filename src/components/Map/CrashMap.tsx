import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CrashEvent } from '../../types';
import { formatters } from '../../utils/formatters';
import SeverityBadge from '../UI/SeverityBadge';
import L from 'leaflet';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CrashMapProps {
    crashes: CrashEvent[];
    onMarkerClick?: (crash: CrashEvent) => void;
}

// Component to handle map bounds
const MapBounds: React.FC<{ crashes: CrashEvent[] }> = ({ crashes }) => {
    const map = useMap();

    useEffect(() => {
        if (crashes.length > 0) {
            const bounds = L.latLngBounds(crashes.map(c => [c.location.coordinates[1], c.location.coordinates[0]]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [crashes, map]);

    return null;
};

const CrashMap: React.FC<CrashMapProps> = ({ crashes, onMarkerClick }) => {
    // Center map on the first crash or default to Colombo
    const center: [number, number] = crashes.length > 0
        ? [crashes[0].location.coordinates[1], crashes[0].location.coordinates[0]]
        : [6.9271, 79.8612];

    // Jitter logic to handle overlapping markers
    const jitteredCrashes = useMemo(() => {
        return crashes.map((crash, index) => {
            // Simple deterministic jitter based on index
            // Offset by ~0.0001 degrees (approx 10 meters)
            const offsetLat = (index % 5) * 0.0001 - 0.0002;
            const offsetLon = (Math.floor(index / 5) % 5) * 0.0001 - 0.0002;

            return {
                ...crash,
                displayLat: crash.location.coordinates[1] + offsetLat,
                displayLon: crash.location.coordinates[0] + offsetLon
            };
        });
    }, [crashes]);

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-700 z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                />
                <MapBounds crashes={crashes} />
                {jitteredCrashes.map((crash) => (
                    <Marker
                        key={crash.event_id}
                        position={[crash.displayLat, crash.displayLon]}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(crash),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900">{crash.event_id}</h3>
                                    <SeverityBadge severity={crash.severity} />
                                </div>
                                <p className="text-sm text-slate-600 mb-1">{formatters.date(crash.timestamp)}</p>
                                <p className="text-sm text-slate-600 mb-2">{crash.location.address}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-100 p-1 rounded">
                                        <span className="block text-slate-500">Impact</span>
                                        <span className="font-semibold text-slate-900">{formatters.gForce(crash.calculated_values.impact_force_g)}</span>
                                    </div>
                                    <div className="bg-slate-100 p-1 rounded">
                                        <span className="block text-slate-500">Speed</span>
                                        <span className="font-semibold text-slate-900">{formatters.speed(crash.calculated_values.speed_previous)}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CrashMap;
