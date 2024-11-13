import { Stethoscope, Calendar, Pill, UserPlus, ClipboardList, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type service = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    title: string,
    description: string
}

const Services = () => {
    return (
        <div className="flex justify-center items-center bg-gradient-to-b from-blue-50 to-white py-16">
            {/* Header */}
            <section className="px-8 py-16 w-full max-w-7xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                <p className="text-xl text-gray-600 mb-12">
                    Comprehensive solutions for modern healthcare management
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    <ServiceCard 
                        icon={Stethoscope}
                        title="Doctor Discovery"
                        description="Find and connect with qualified healthcare providers in your area. Read reviews, check availability, and book appointments instantly."
                    />
                    <ServiceCard 
                        icon={Calendar}
                        title="Smart Scheduling"
                        description="Efficiently manage appointments with automated scheduling, reminders, and real-time availability updates for both doctors and patients."
                    />
                    <ServiceCard 
                        icon={Pill}
                        title="Prescription Management"
                        description="Digital prescription system with medication tracking, refill reminders, and built-in drug interaction checks for patient safety."
                    />
                    <ServiceCard 
                        icon={UserPlus}
                        title="Patient Management"
                        description="Comprehensive patient profiles with medical history, treatment plans, and secure communication channels."
                    />
                    <ServiceCard 
                        icon={ClipboardList}
                        title="Digital Records"
                        description="Secure electronic health records with easy access for authorized healthcare providers and patients."
                    />
                    <ServiceCard 
                        icon={Calendar}
                        title="Follow-up Care"
                        description="Automated follow-up scheduling and monitoring of patient recovery progress with customizable care plans."
                    />
                </div>
            </section>

            {/* Decorative elements */}
            <div className="w-[200px] h-[200px] bg-blue-600/20 blur-[100px] absolute bottom-[80px] right-[80px] pointer-events-none" />
            <div className="w-[200px] h-[200px] bg-blue-400/20 blur-[100px] absolute top-[80px] left-[80px] pointer-events-none" />
        </div>
    );
};

const ServiceCard = ({ icon: Icon, title, description }: service) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center justify-center">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex flex-col items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

export default Services;