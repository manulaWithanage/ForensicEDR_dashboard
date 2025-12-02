import { useState, useMemo } from 'react';
import { Filter, Search, ArrowUpDown, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { useCrashes } from '../hooks/useCrashData';
import CrashMap from '../components/Map/CrashMap';
import CrashDetailModal from '../components/Crash/CrashDetailModal';
import SeverityBadge from '../components/UI/SeverityBadge';
import { formatters } from '../utils/formatters';
import type { CrashEvent } from '../types';

const CrashAnalytics = () => {
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [selectedCrash, setSelectedCrash] = useState<CrashEvent | null>(null);
    const [filters, setFilters] = useState({
        severity: 'all',
        type: 'all',
        search: ''
    });

    const { data: crashes, isLoading } = useCrashes();

    // IMPORTANT: Call all hooks unconditionally BEFORE any early returns
    const filteredCrashes = useMemo(() => {
        if (!crashes) return [];
        return crashes.filter(crash => {
            const matchesSeverity = filters.severity === 'all' || crash.severity === filters.severity;
            const matchesType = filters.type === 'all' || crash.crash_type === filters.type;
            const matchesSearch = crash.event_id.toLowerCase().includes(filters.search.toLowerCase()) ||
                crash.location.address.toLowerCase().includes(filters.search.toLowerCase());
            return matchesSeverity && matchesType && matchesSearch;
        });
    }, [crashes, filters]);

    const stats = useMemo(() => {
        if (!filteredCrashes.length) return null;
        const avgImpact = filteredCrashes.reduce((acc, c) => acc + c.calculated_values.impact_force_g, 0) / filteredCrashes.length;
        const peakSpeed = Math.max(...filteredCrashes.map(c => c.calculated_values.speed_previous));
        const hotspots = filteredCrashes.reduce((acc, c) => {
            const city = c.location.address.split(',')[0];
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const topHotspot = Object.entries(hotspots).sort((a, b) => b[1] - a[1])[0];

        return {
            avgImpact,
            peakSpeed,
            topHotspot
        };
    }, [filteredCrashes]);

    // NOW we can safely do conditional rendering
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-primary">Crash Analytics</h1>

                <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-slate-700 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        <MapIcon size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-surface p-4 rounded-xl border border-slate-700 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-text-secondary">
                    <Filter size={20} />
                    <span className="font-medium">Filters:</span>
                </div>

                <select
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filters.severity}
                    onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                >
                    <option value="all">All Severities</option>
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                </select>

                <select
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                    <option value="all">All Crash Types</option>
                    <option value="frontal_impact_collision">Frontal Impact</option>
                    <option value="side_impact_collision">Side Impact</option>
                    <option value="rear_end_collision">Rear End</option>
                    <option value="rollover_event">Rollover</option>
                </select>

                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Event ID or Location..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-surface p-4 rounded-xl border border-slate-700">
                        <div className="text-text-secondary text-sm mb-1">Avg Impact Force</div>
                        <div className="text-2xl font-bold text-text-primary">{formatters.gForce(stats.avgImpact)}</div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-slate-700">
                        <div className="text-text-secondary text-sm mb-1">Peak Speed Recorded</div>
                        <div className="text-2xl font-bold text-text-primary">{formatters.speed(stats.peakSpeed)}</div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-slate-700">
                        <div className="text-text-secondary text-sm mb-1">Top Hotspot</div>
                        <div className="text-2xl font-bold text-text-primary">{stats.topHotspot ? stats.topHotspot[0] : 'N/A'}</div>
                        <div className="text-xs text-text-secondary">{stats.topHotspot ? `${stats.topHotspot[1]} incidents` : ''}</div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {viewMode === 'map' ? (
                <CrashMap crashes={filteredCrashes} onMarkerClick={setSelectedCrash} />
            ) : (
                <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary min-w-[800px]">
                            <thead className="text-xs text-text-secondary uppercase bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 cursor-pointer hover:text-primary">Event ID <ArrowUpDown size={14} className="inline ml-1" /></th>
                                    <th className="px-6 py-3 cursor-pointer hover:text-primary">Date & Time <ArrowUpDown size={14} className="inline ml-1" /></th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Severity</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3 text-right">Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCrashes.map((crash) => (
                                    <tr
                                        key={crash.event_id}
                                        onClick={() => setSelectedCrash(crash)}
                                        className="border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-text-primary">{crash.event_id}</td>
                                        <td className="px-6 py-4">{formatters.date(crash.timestamp)}</td>
                                        <td className="px-6 py-4">{crash.location.address}</td>
                                        <td className="px-6 py-4"><SeverityBadge severity={crash.severity} /></td>
                                        <td className="px-6 py-4 capitalize">{crash.crash_type.replace(/_/g, ' ')}</td>
                                        <td className="px-6 py-4 text-right font-mono text-text-primary">{formatters.gForce(crash.calculated_values.impact_force_g)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedCrash && (
                <CrashDetailModal
                    initialCrash={selectedCrash}
                    onClose={() => setSelectedCrash(null)}
                />
            )}
        </div>
    );
};

export default CrashAnalytics;
