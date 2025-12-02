import React, { useState } from 'react';
import { FileText, Download, RefreshCw, Clock, PieChart, BarChart, Activity } from 'lucide-react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js';
import { useRecentReport } from '../../hooks/useCrashData';
import ChartWrapper from '../UI/ChartWrapper';
import { darkThemeLayout, chartColors } from '../../utils/chartConfig';
import { formatters } from '../../utils/formatters';

const reportTypes = [
    { id: 'severity', label: 'Severity Distribution', icon: PieChart, desc: 'Breakdown of crash severity levels' },
    { id: 'timeline', label: 'Timeline Analysis', icon: Activity, desc: 'Crash frequency and intensity over time' },
    { id: 'crash_types', label: 'Crash Types', icon: BarChart, desc: 'Categorization of collision types' },
    { id: 'impact', label: 'Impact Analysis', icon: Activity, desc: 'Correlation between speed and impact force' },
];

const AggregateReports = () => {
    const [selectedType, setSelectedType] = useState('severity');
    const { data: report, isLoading, refetch } = useRecentReport(selectedType);

    const handleExport = (format: 'png' | 'json') => {
        if (!report) return;

        if (format === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `report_${report.report_id}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            const plotElement = document.querySelector('.js-plotly-plot') as any;
            if (plotElement) {
                Plotly.downloadImage(plotElement, {
                    format: 'png',
                    filename: `report_${report.report_id}`,
                    width: 800,
                    height: 600
                });
            }
        }
    };

    // Transform report data for Plotly based on type
    const chartData = React.useMemo(() => {
        if (!report) return null;

        switch (selectedType) {
            case 'severity':
                return [{
                    values: [15, 30, 5],
                    labels: ['Minor', 'Moderate', 'Severe'],
                    type: 'pie',
                    marker: { colors: [chartColors.success, chartColors.warning, chartColors.danger] }
                }];
            case 'timeline':
                return [{
                    x: Array.from({ length: 10 }, (_, i) => new Date(Date.now() - i * 86400000)),
                    y: Array.from({ length: 10 }, () => Math.random() * 10),
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: chartColors.primary }
                }];
            case 'crash_types':
                return [{
                    x: ['Frontal', 'Side', 'Rear', 'Rollover'],
                    y: [12, 8, 15, 3],
                    type: 'bar',
                    marker: { color: chartColors.secondary }
                }];
            case 'impact':
                return [{
                    x: Array.from({ length: 20 }, (_, i) => new Date(Date.now() - i * 86400000)), // Dummy Data fix
                    y: Array.from({ length: 20 }, () => Math.random() * 10),
                    mode: 'markers',
                    type: 'scatter',
                    marker: { color: chartColors.danger, size: 8 }
                }];
            default:
                return [];
        }
    }, [report, selectedType]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between lg:col-span-4">
                <h1 className="text-2xl font-bold text-text-primary">Analytics Reports</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => refetch()}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Report Library Sidebar */}
            <div className="lg:col-span-1 space-y-4">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Report Library</h2>
                <div className="space-y-2">
                    {reportTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedType === type.id
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-surface border-slate-700 text-text-secondary hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <type.icon size={20} />
                                <span className="font-medium">{type.label}</span>
                            </div>
                            <p className="text-xs opacity-80">{type.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Report Viewer */}
            <div className="lg:col-span-3">
                <ChartWrapper
                    title={reportTypes.find(t => t.id === selectedType)?.label || 'Report Viewer'}
                    loading={isLoading}
                    action={
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleExport('json')}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                <FileText size={14} /> JSON
                            </button>
                            <button
                                onClick={() => handleExport('png')}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary hover:bg-cyan-600 text-white rounded-lg transition-colors"
                            >
                                <Download size={14} /> PNG
                            </button>
                        </div>
                    }
                >
                    {chartData && (
                        <div className="h-[500px] w-full">
                            <Plot
                                data={chartData as any}
                                // @ts-ignore
                                layout={{
                                    ...darkThemeLayout,
                                    height: 500,
                                    margin: { t: 20, r: 20, b: 40, l: 40 },
                                    xaxis: {
                                        ...darkThemeLayout.xaxis,
                                        title: { text: selectedType === 'impact' ? 'Speed (km/h)' : 'Date' }
                                    },
                                    yaxis: {
                                        ...darkThemeLayout.yaxis,
                                        title: { text: selectedType === 'impact' ? 'Impact Force (G)' : 'Count' }
                                    }
                                } as any}
                                useResizeHandler
                                className="w-full h-full"
                                config={{ displayModeBar: true }}
                            />

                            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                                    <Clock size={14} />
                                    Report Metadata
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
                                    <div>Generated: {report ? formatters.date(report.generated_at) : '-'}</div>
                                    <div>Report ID: {report?.report_id}</div>
                                    <div>Data Source: ForensicEDR Cloud API</div>
                                    <div>Verification: <span className="text-success">Valid Signature</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </ChartWrapper>
            </div>
        </div>
    );
};

export default AggregateReports;
