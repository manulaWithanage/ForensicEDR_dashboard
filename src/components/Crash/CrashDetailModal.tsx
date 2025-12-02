import React from 'react';
import { X, MapPin, Clock, Activity, AlertTriangle, Shield, Cpu, Loader2 } from 'lucide-react';
import type { CrashEvent } from '../../types';
import { formatters } from '../../utils/formatters';
import SeverityBadge from '../UI/SeverityBadge';
import TelematicsCharts from '../Analytics/TelematicsCharts';

import { useCrash } from '../../hooks/useCrashData';

interface CrashDetailModalProps {
    initialCrash: CrashEvent | null;
    onClose: () => void;
}

const CrashDetailModal: React.FC<CrashDetailModalProps> = ({ initialCrash, onClose }) => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'telematics'>('overview');
    const { data: fullCrash, isLoading } = useCrash(initialCrash?.event_id || '');

    // Use full details if available, otherwise fall back to summary
    const crash = fullCrash || initialCrash;

    if (!crash) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-slate-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-surface border-b border-slate-700 p-6 z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-text-primary">Event Details</h2>
                                <span className="text-text-secondary">#{crash.event_id}</span>
                                <SeverityBadge severity={crash.severity} />
                            </div>
                            <p className="text-text-secondary flex items-center gap-2">
                                <Clock size={16} />
                                {formatters.date(crash.timestamp)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-text-secondary" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-slate-700">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Overview
                            {activeTab === 'overview' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('telematics')}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'telematics' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            Telematics & Sensor Data
                            {activeTab === 'telematics' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                            {/* Location & Device */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                        <MapPin className="text-primary" size={20} />
                                        Location Data
                                    </h3>
                                    <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                                        <div>
                                            <label className="text-xs text-text-secondary uppercase">Address</label>
                                            <p className="text-text-primary">{crash.location.address}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-secondary uppercase">Coordinates</label>
                                            <p className="text-text-primary font-mono">{formatters.coordinates(crash.location.coordinates)}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                        <Cpu className="text-secondary" size={20} />
                                        Device Information
                                    </h3>
                                    <div className="bg-slate-900/50 rounded-lg p-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-text-secondary uppercase">Device ID</label>
                                            <p className="text-text-primary font-mono">{crash.metadata.device_id}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-secondary uppercase">Firmware</label>
                                            <p className="text-text-primary">{crash.metadata.firmware_version}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-secondary uppercase">Power Status</label>
                                            <p className="text-success">{crash.calculated_values.power_status}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Telemetry & Analysis */}
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                        <Activity className="text-warning" size={20} />
                                        Impact Analysis
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded-lg">
                                            <label className="text-xs text-text-secondary uppercase">Impact Force</label>
                                            <p className="text-2xl font-bold text-text-primary">{formatters.gForce(crash.calculated_values.impact_force_g)}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-lg">
                                            <label className="text-xs text-text-secondary uppercase">Pre-Crash Speed</label>
                                            <p className="text-2xl font-bold text-text-primary">{formatters.speed(crash.calculated_values.speed_previous)}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-lg">
                                            <label className="text-xs text-text-secondary uppercase">Deceleration</label>
                                            <p className="text-xl font-semibold text-text-primary">{formatters.deceleration(crash.calculated_values.deceleration)}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-lg">
                                            <label className="text-xs text-text-secondary uppercase">Tilt Angle</label>
                                            <p className="text-xl font-semibold text-text-primary">{(crash.calculated_values.tilt || 0).toFixed(1)}°</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                        <AlertTriangle className="text-danger" size={20} />
                                        Critical Events
                                    </h3>
                                    <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                            <span className="text-text-secondary">Airbag Deployed</span>
                                            <span className={crash.calculated_values.airbag_status === 'True' ? 'text-danger font-bold' : 'text-text-primary'}>
                                                {crash.calculated_values.airbag_status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                            <span className="text-text-secondary">Hard Braking</span>
                                            <span className={crash.calculated_values.hard_brake_event === 'Yes' ? 'text-warning font-bold' : 'text-text-primary'}>
                                                {crash.calculated_values.hard_brake_event}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-secondary">Rollover Risk</span>
                                            <span className={crash.crash_type === 'rollover_event' ? 'text-danger font-bold' : 'text-success'}>
                                                {crash.crash_type === 'rollover_event' ? 'DETECTED' : 'None'}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <span className="ml-2 text-text-secondary">Loading high-frequency telemetry...</span>
                            </div>
                        ) : (
                            <TelematicsCharts data={crash.raw_data || []} />
                        )
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-surface border-t border-slate-700 p-6 flex justify-end gap-4">
                    <button className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-primary hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                        <Shield size={18} />
                        Verify Chain of Custody
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrashDetailModal;
