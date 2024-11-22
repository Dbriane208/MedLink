import AppointmentsTable from "../../components/admin/AppointmentsTable";
import DoctorsSidebar from "../../components/doctor/Sidebar";

const DoctorsPage = () => {
    return (
        <div className="fixed inset-0 flex w-full h-full bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar - Fixed on the left */}
            <div className="h-full w-64 flex-shrink-0 border-r border-gray-200">
                <DoctorsSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Testimonials Section */}
                <div className="flex-1 w-full overflow-y-auto">
                    <AppointmentsTable />
                </div>
            </div>
        </div>
    );
};

export default DoctorsPage;