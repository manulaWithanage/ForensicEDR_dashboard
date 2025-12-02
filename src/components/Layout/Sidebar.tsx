import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, ShieldCheck, FileText, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const [isOpen, setIsOpen] = React.useState(true);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/analytics', label: 'Crash Analytics', icon: Activity },
        { path: '/reports', label: 'Reports', icon: FileText },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-md text-text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={clsx(
                "fixed top-0 left-0 z-40 h-screen transition-transform bg-surface border-r border-slate-700 w-64",
                { "-translate-x-full lg:translate-x-0": !isOpen }
            )}>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="flex items-center pl-2.5 mb-8 mt-2">
                        <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-text-primary">
                            ForensicEDR
                        </span>
                    </div>

                    <ul className="space-y-2 font-medium">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => clsx(
                                        "flex items-center p-3 rounded-lg group transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-secondary hover:bg-slate-700 hover:text-text-primary"
                                    )}
                                >
                                    <item.icon className={clsx("w-5 h-5 transition duration-75")} />
                                    <span className="ml-3">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
