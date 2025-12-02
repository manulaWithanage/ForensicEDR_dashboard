import { useMemo } from 'react';
import { Activity, AlertTriangle, ShieldCheck, HardDrive, ArrowRight } from 'lucide-react';
import Plot from 'react-plotly.js';
import { useCrashes } from '../hooks/useCrashData';
import KPICard from '../components/UI/KPICard';
import ChartWrapper from '../components/UI/ChartWrapper';
import SeverityBadge from '../components/UI/SeverityBadge';
import { darkThemeLayout, chartColors } from '../utils/chartConfig';
import { formatters } from '../utils/formatters';

const Overview = () => {
    const { data: crashes, isLoading, error } = useCrashes();

    // Calculate KPIs
    const kpis = useMemo(() => {
        if (!crashes) return null;

        const total = crashes.length;
        const severe = crashes.filter(c => c.severity === 'severe').length;
        const devices = new Set(crashes.map(c => c.metadata.device_id)).size;
        // Mock verified count for now since we don't fetch all logs here
        const verified = Math.floor(total * 0.92);

        return { total, severe, devices, verified };
    }, [crashes]);

    // Prepare Chart Data
    const charts = useMemo(() => {
        if (!crashes) return null;

        // Severity Distribution
        const severityCounts = crashes.reduce((acc, c) => {
            acc[c.severity] = (acc[c.severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Timeline
        const timelineData = crashes
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map(c => ({
                x: c.timestamp,
                y: c.calculated_values.impact_force_g,
                text: c.crash_type
            }));

        // Crash Types
        const typeCounts = crashes.reduce((acc, c) => {
            acc[c.crash_type] = (acc[c.crash_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            severity: {
                values: Object.values(severityCounts),
                labels: Object.keys(severityCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                type: 'pie',
                marker: {
                    colors: [chartColors.success, chartColors.warning, chartColors.danger]
                }
            },
            timeline: {
                x: timelineData.map(d => d.x),
                y: timelineData.map(d => d.y),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: chartColors.primary },
                name: 'Impact Force'
            },
            types: {
                x: Object.keys(typeCounts).map(t => t.replace(/_/g, ' ')),
                y: Object.values(typeCounts),
                type: 'bar',
                marker: { color: chartColors.secondary }
            }
        };
    }, [crashes]);

    if (error) {
        return <div className="text-danger">Failed to load dashboard data</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
                <span className="text-sm text-text-secondary">Last updated: {formatters.date(new Date().toISOString())}</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Crashes"
                    value={kpis?.total || 0}
                    icon={Activity}
                    loading={isLoading}
                    trend={{ value: 12, isPositive: true }}
                />
                <KPICard
                    title="Severe Incidents"
                    value={kpis?.severe || 0}
                    icon={AlertTriangle}
                    color="danger"
                    loading={isLoading}
                    trend={{ value: 5, isPositive: false }}
                />
                <KPICard
                    title="Verified Evidence"
                    value={kpis ? formatters.percentage(kpis.verified / kpis.total) : '0%'}
                    icon={ShieldCheck}
                    color="success"
                    loading={isLoading}
                />
                <KPICard
                    title="Active Devices"
                    value={kpis?.devices || 0}
                    icon={HardDrive}
                    color="secondary"
                    loading={isLoading}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Severity Distribution" loading={isLoading}>
                    {charts && (
                        <Plot
                            data={[charts.severity as any]}
                            layout={{
                                ...darkThemeLayout,
                                height: 300,
                                margin: { t: 0, b: 20, l: 20, r: 20 }
                            } as any}
                            useResizeHandler
                            className="w-full h-full"
                            config={{ displayModeBar: false }}
                        />
                    )}
                </ChartWrapper>

                <ChartWrapper title="Impact Force Timeline" loading={isLoading}>
                    {charts && (
                        <Plot
                            data={[charts.timeline as any]}
                            layout={{
                                ...darkThemeLayout,
                                height: 300,
                                xaxis: { ...darkThemeLayout.xaxis, title: { text: 'Time' } },
                                yaxis: { ...darkThemeLayout.yaxis, title: { text: 'Force (G)' } }
                            } as any}
                            useResizeHandler
                            className="w-full h-full"
                            config={{ displayModeBar: false }}
                        />
                    )}
                </ChartWrapper>

                <ChartWrapper title="Crash Types" loading={isLoading}>
                    {charts && (
                        <Plot
                            data={[charts.types as any]}
                            layout={{
                                ...darkThemeLayout,
                                height: 300,
                                xaxis: { ...darkThemeLayout.xaxis, tickangle: -45 },
                            } as any}
                            useResizeHandler
                            className="w-full h-full"
                            config={{ displayModeBar: false }}
                        />
                    )}
                </ChartWrapper>

                <ChartWrapper title="Recent Activity" loading={isLoading}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-text-secondary uppercase bg-surface border-b border-slate-700">
                                <tr>
                                    <th className="px-4 py-3">Event ID</th>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">Severity</th>
                                    <th className="px-4 py-3">Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {crashes?.slice(0, 5).map((crash) => (
                                    <tr key={crash.event_id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium text-text-primary">{crash.event_id}</td>
                                        <td className="px-4 py-3">{formatters.relativeTime(crash.timestamp)}</td>
                                        <td className="px-4 py-3">
                                            <SeverityBadge severity={crash.severity} />
                                        </td>
                                        <td className="px-4 py-3">{formatters.gForce(crash.calculated_values.impact_force_g)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-center">
                            <button className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center">
                                View All Crashes <ArrowRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </ChartWrapper>
            </div>
        </div>
    );
};

export default Overview;
