import React from 'react';
import clsx from 'clsx';

interface SeverityBadgeProps {
    severity: 'minor' | 'moderate' | 'severe';
    className?: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
    const styles = {
        minor: 'bg-success/10 text-success border-success/20',
        moderate: 'bg-warning/10 text-warning border-warning/20',
        severe: 'bg-danger/10 text-danger border-danger/20',
    };

    return (
        <span className={clsx(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide",
            styles[severity],
            className
        )}>
            {severity}
        </span>
    );
};

export default SeverityBadge;
