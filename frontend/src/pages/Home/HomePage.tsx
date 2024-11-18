import Doctors from "../../components/home/Doctor";
import ResponsiveSearchbar from "../../components/home/Searchbar";
import ResponsiveSidebar from "../../components/home/Sidebar";

const HomePage = () => {
    return (
        <div className="fixed inset-0 flex w-full h-full bg-gradient-to-b from-blue-50 to-white">
            {/* Sidebar - Fixed on the left */}
            <div className="h-full w-64 flex-shrink-0 border-r border-gray-200">
                <ResponsiveSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Search Bar Section */}
                <div className="w-full flex justify-center items-center p-6 border-b border-gray-200">
                    <div className="w-full max-w-3xl">
                        <ResponsiveSearchbar />
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="flex-1 w-full overflow-y-auto">
                    <Doctors />
                </div>
            </div>
        </div>
    );
};

export default HomePage;