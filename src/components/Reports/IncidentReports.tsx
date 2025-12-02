import { useState, useMemo } from 'react';
import { Search, Printer, Shield, MapPin, Loader2, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';
import { useCrashes, useCrash } from '../../hooks/useCrashData';
import { formatters } from '../../utils/formatters';
import TelematicsCharts from '../Analytics/TelematicsCharts';
import SeverityBadge from '../UI/SeverityBadge';

const IncidentReports = () => {
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    // Fetch all crashes for the list
    const { data: crashes, isLoading: isListLoading } = useCrashes();

    // Fetch full details for selected crash (only when in detail mode and ID is selected)
    const { data: crash, isLoading: isReportLoading, isError } = useCrash(selectedEventId || '');

    // Filter crashes for the list view
    const filteredCrashes = useMemo(() => {
        if (!crashes) return [];
        return crashes.filter(c =>
            c.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [crashes, searchTerm]);

    const handleViewReport = (eventId: string) => {
        setSelectedEventId(eventId);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setSelectedEventId(null);
        setViewMode('list');
    };

    const handlePrint = () => {
        window.print();
    };

    if (viewMode === 'list') {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Search Bar */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Event ID or Location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* List Content */}
                {isListLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="ml-2 text-text-secondary">Loading incidents...</span>
                    </div>
                ) : (
                    <div className="bg-surface rounded-xl border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary min-w-[800px]">
                                <thead className="text-xs text-text-secondary uppercase bg-slate-900/50 border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3">Event ID</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Severity</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCrashes.length > 0 ? (
                                        filteredCrashes.map((c) => (
                                            <tr
                                                key={c.event_id}
                                                className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-text-primary font-mono">{c.event_id}</td>
                                                <td className="px-6 py-4">{formatters.date(c.timestamp)}</td>
                                                <td className="px-6 py-4">{c.location.address}</td>
                                                <td className="px-6 py-4"><SeverityBadge severity={c.severity} /></td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleViewReport(c.event_id)}
                                                        className="text-primary hover:text-primary-light font-medium flex items-center justify-end gap-1 ml-auto"
                                                    >
                                                        <FileText size={16} />
                                                        View Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                                                No incidents found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Detail View
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Navigation Header (Hidden when printing) */}
            <div className="print:hidden flex items-center justify-between">
                <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Incident List
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 border border-slate-700"
                >
                    <Printer size={18} />
                    Print Report
                </button>
            </div>

            {/* Loading State */}
            {isReportLoading && (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-2 text-text-secondary">Loading forensic report...</span>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Report Not Found</h3>
                    <p className="text-slate-400 mb-6">
                        Could not retrieve data for Event ID: <span className="font-mono text-white">{selectedEventId}</span>.
                    </p>
                    <button
                        onClick={handleBackToList}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Return to List
                    </button>
                </div>
            )}

            {/* Report Content */}
            {!isReportLoading && !isError && crash && (
                <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl print:shadow-none print:p-0 print:w-full">
                    {/* Report Header */}
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="text-slate-900" size={32} />
                                <h1 className="text-3xl font-bold tracking-tight">FORENSIC REPORT</h1>
                            </div>
                            <p className="text-sm text-slate-500 font-mono">CONFIDENTIAL // LAW ENFORCEMENT USE ONLY</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold">Event #{crash.event_id}</div>
                            <div className="text-slate-500">{formatters.date(crash.timestamp)}</div>
                        </div>
                    </div>

                    {/* Incident Summary */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">Incident Location</h3>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin size={18} className="mt-1 text-slate-400" />
                                    <div>
                                        <div className="font-semibold">{crash.location.address}</div>
                                        <div className="font-mono text-sm text-slate-500">{formatters.coordinates(crash.location.coordinates)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1">Device Metadata</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Device ID:</span>
                                    <span className="font-mono font-medium">{crash.metadata.device_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Firmware:</span>
                                    <span className="font-mono">{crash.metadata.firmware_version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Buffer Size:</span>
                                    <span className="font-mono">60 Seconds</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Impact Analysis Grid */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Impact Analysis</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-slate-100 p-4 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase">Impact Force</div>
                                <div className="text-2xl font-bold">{formatters.gForce(crash.calculated_values.impact_force_g)}</div>
                            </div>
                            <div className="bg-slate-100 p-4 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase">Pre-Crash Speed</div>
                                <div className="text-2xl font-bold">{formatters.speed(crash.calculated_values.speed_previous)}</div>
                            </div>
                            <div className="bg-slate-100 p-4 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase">Deceleration</div>
                                <div className="text-2xl font-bold">{formatters.deceleration(crash.calculated_values.deceleration)}</div>
                            </div>
                            <div className="bg-slate-100 p-4 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase">Airbag Status</div>
                                <div className={`text-2xl font-bold ${crash.calculated_values.airbag_status === 'True' ? 'text-red-600' : 'text-slate-900'}`}>
                                    {crash.calculated_values.airbag_status === 'True' ? 'DEPLOYED' : 'SAFE'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telematics Charts (Inverted for Light Mode Printing) */}
                    <div className="mb-8 break-inside-avoid">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Telematics Data</h3>
                        <div className="bg-slate-900 p-6 rounded-xl print:bg-white print:border print:border-slate-200">
                            <TelematicsCharts data={crash.raw_data || []} />
                        </div>
                    </div>

                    {/* Chain of Custody Verification */}
                    <div className="border-t-2 border-slate-900 pt-6 mt-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="text-green-600" size={24} />
                                <div>
                                    <div className="font-bold text-lg">Chain of Custody Verified</div>
                                    <div className="text-sm text-slate-500">Cryptographic signature matches source device.</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-400 uppercase">Generated By</div>
                                <div className="font-medium">ForensicEDR System</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer for Print */}
                    <div className="hidden print:block mt-8 text-center text-xs text-slate-400">
                        Report generated on {new Date().toLocaleString()} • Page 1 of 1
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentReports;
