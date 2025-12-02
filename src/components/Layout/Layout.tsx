import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Sidebar />
            <div className="p-4 lg:ml-64 min-h-screen">
                <div className="p-4 mt-14 lg:mt-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
