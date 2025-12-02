export interface CrashEvent {
    event_id: string;
    timestamp: string;
    crash_type: 'frontal_impact_collision' | 'side_impact_collision' | 'rear_end_collision' | 'rollover_event';
    severity: 'minor' | 'moderate' | 'severe';
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
        address: string;
    };
    calculated_values: {
        speed_now: number;
        speed_previous: number;
        deceleration: number;
        impact_force_g: number;
        hard_brake_event: 'Yes' | 'No' | null;
        airbag_status: 'True' | 'False';
        power_status: string | null;
        tilt: number | null;
    };
    metadata: {
        device_id: string;
        firmware_version: string;
    };
    raw_data?: TelemetryPoint[];
}

export interface TelemetryPoint {
    timestamp: string;
    speed: number;
    rpm: number;
    throttle_pos: number;
    engine_load: number;
    coolant_temp: number;
    fuel_level: number;
    latitude: number;
    longitude: number;
    accel_x: number;
    accel_y: number;
    accel_z: number;
    total_acceleration: number;
    angular_acceleration: number;
    tilt: number;
    airbag_status: string;
    power_status: string;
    hard_brake_event: number;
}

export interface EvidenceCustodyLog {
    entry_id: string;
    timestamp: string;
    event_id: string;
    action: 'EVIDENCE_COLLECTION' | 'TRANSFER' | 'ACCESS';
    actor: 'EDGE_DEVICE_V2' | 'CLOUD_API';
    location: string;
    previous_hash: string;
    entry_hash: string;
    verified: boolean;
}

export interface ReportData {
    report_id: string;
    report_type: 'severity' | 'timeline' | 'geographic' | 'crash_types' | 'impact';
    generated_at: string;
    data: any; // Structure depends on report type
}

export interface CrashFilters {
    severity?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
}
