import Welcome from "../../components/landing/Welcome";
import Services from "../../components/landing/Services";
import Testimonial from "../../components/landing/Testimonials";
import ResponsiveFooter from "../../components/landing/Footer";

function LandingPage() {
    return (
        <div className="flex flex-col items-center w-full h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Welcome Section */}
            <section className="w-screen">
                <Welcome />
            </section>

            {/* Services Section */}
            <section className="w-screen">
                <Services />
            </section>

            {/* Testimonial Section */}
            <section className="w-screen">
                <Testimonial />
            </section>

            {/* Footer Section */}
            <footer className="w-screen">
                <ResponsiveFooter />
            </footer>
        </div>
    );
}

export default LandingPage;