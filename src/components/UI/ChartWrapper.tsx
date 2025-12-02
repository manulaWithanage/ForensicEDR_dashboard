import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ChartWrapperProps {
    title: string;
    children: React.ReactNode;
    loading?: boolean;
    error?: boolean;
    onRetry?: () => void;
    action?: React.ReactNode;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
    title,
    children,
    loading,
    error,
    onRetry,
    action
}) => {
    return (
        <div className="bg-surface border border-slate-700 rounded-xl p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary">{title}</h3>
                {action}
            </div>

            <div className="flex-1 relative min-h-[300px] w-full">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <span className="text-sm text-text-secondary">Loading data...</span>
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-danger mb-2" />
                        <span className="text-sm text-text-secondary mb-3">Failed to load chart data</span>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default ChartWrapper;
