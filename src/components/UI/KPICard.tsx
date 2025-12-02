import React from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color = 'primary',
    loading = false
}) => {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-danger/10 text-danger',
    };

    if (loading) {
        return (
            <div className="p-6 rounded-xl bg-surface border border-slate-700 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                    <div className="h-10 w-10 bg-slate-700 rounded-lg"></div>
                </div>
                <div className="h-8 w-16 bg-slate-700 rounded mb-2"></div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-xl bg-surface border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
                <div className={clsx("p-2 rounded-lg", colorClasses[color])}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-text-primary">{value}</div>
                {trend && (
                    <div className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        trend.isPositive ? "text-success bg-success/10" : "text-danger bg-danger/10"
                    )}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default KPICard;
