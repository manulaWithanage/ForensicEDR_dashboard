import IncidentReports from '../components/Reports/IncidentReports';

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">Forensic Incident Reports</h1>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                <IncidentReports />
            </div>
        </div>
    );
};

export default Reports;
