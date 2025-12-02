import React from 'react';
import Plot from 'react-plotly.js';
import type { TelemetryPoint } from '../../types';
import { Activity, Gauge, Zap } from 'lucide-react';

interface TelematicsChartsProps {
    data: TelemetryPoint[];
}

const TelematicsCharts: React.FC<TelematicsChartsProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-700">
                <p className="text-slate-400">No telemetry data available for this event.</p>
            </div>
        );
    }

    // Prepare Data Arrays
    const timestamps = data.map(d => d.timestamp);
    const speeds = data.map(d => d.speed);
    const accelX = data.map(d => d.accel_x);
    const accelY = data.map(d => d.accel_y);
    const accelZ = data.map(d => d.accel_z);
    const rpm = data.map(d => d.rpm);
    const throttle = data.map(d => d.throttle_pos);
    const load = data.map(d => d.engine_load);
    const angularAccel = data.map(d => d.angular_acceleration);

    // Common Layout Config
    const darkLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8' },
        margin: { t: 30, r: 20, b: 40, l: 40 },
        xaxis: { gridcolor: '#334155', showgrid: true },
        yaxis: { gridcolor: '#334155', showgrid: true },
        legend: { orientation: 'h' as const, y: -0.2 },
        autosize: true,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Row 1: Speed Heatmap & Angular Acceleration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="text-cyan-400" size={20} />
                        <h3 className="text-lg font-semibold text-slate-100">Speed Profile (Heatmap)</h3>
                    </div>
                    <Plot
                        data={[
                            {
                                x: timestamps,
                                y: speeds,
                                type: 'scatter',
                                mode: 'markers',
                                marker: {
                                    color: speeds,
                                    colorscale: 'RdBu',
                                    reversescale: true,
                                    size: 8,
                                    showscale: true
                                },
                                name: 'Speed'
                            }
                        ]}
                        layout={{
                            ...darkLayout,
                            height: 300,
                            yaxis: { ...darkLayout.yaxis, title: { text: 'Speed (km/h)' } }
                        }}
                        useResizeHandler
                        className="w-full"
                        config={{ displayModeBar: false }}
                    />
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="text-yellow-400" size={20} />
                        <h3 className="text-lg font-semibold text-slate-100">Angular Acceleration (Sharp Turns)</h3>
                    </div>
                    <Plot
                        data={[
                            {
                                x: timestamps,
                                y: angularAccel,
                                type: 'scatter',
                                mode: 'lines',
                                line: { color: '#facc15', width: 2 },
                                name: 'Angular Accel'
                            }
                        ]}
                        layout={{
                            ...darkLayout,
                            height: 300,
                            yaxis: { ...darkLayout.yaxis, title: { text: 'rad/s²' } }
                        }}
                        useResizeHandler
                        className="w-full"
                        config={{ displayModeBar: false }}
                    />
                </div>
            </div>

            {/* Row 2: 3-Axis Acceleration Waveform */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-red-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-100">Acceleration Waveforms (X, Y, Z)</h3>
                </div>
                <Plot
                    data={[
                        { x: timestamps, y: accelX, type: 'scatter', mode: 'lines', name: 'Accel X (Lateral)', line: { color: '#38bdf8' } },
                        { x: timestamps, y: accelY, type: 'scatter', mode: 'lines', name: 'Accel Y (Longitudinal)', line: { color: '#f472b6' } },
                        { x: timestamps, y: accelZ, type: 'scatter', mode: 'lines', name: 'Accel Z (Vertical)', line: { color: '#4ade80' } },
                    ]}
                    layout={{
                        ...darkLayout,
                        height: 350,
                        yaxis: { ...darkLayout.yaxis, title: { text: 'G-Force' } }
                    }}
                    useResizeHandler
                    className="w-full"
                    config={{ displayModeBar: true }}
                />
            </div>

            {/* Row 3: Fuel Efficiency & Engine Load */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Gauge className="text-green-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-100">Engine Telematics (RPM vs Load vs Throttle)</h3>
                </div>
                <Plot
                    data={[
                        {
                            x: rpm,
                            y: load,
                            mode: 'markers',
                            type: 'scatter',
                            name: 'Engine Load',
                            marker: {
                                color: throttle,
                                colorscale: 'Viridis',
                                size: 6,
                                showscale: true,
                                colorbar: { title: { text: 'Throttle %' } }
                            }
                        }
                    ]}
                    layout={{
                        ...darkLayout,
                        height: 350,
                        xaxis: { ...darkLayout.xaxis, title: { text: 'Engine RPM' } },
                        yaxis: { ...darkLayout.yaxis, title: { text: 'Engine Load %' } }
                    }}
                    useResizeHandler
                    className="w-full"
                    config={{ displayModeBar: false }}
                />
            </div>
        </div>
    );
};

export default TelematicsCharts;
