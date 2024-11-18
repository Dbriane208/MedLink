import { FaQuoteLeft } from 'react-icons/fa';

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    photo: string;
}

export default function Testimonial() {
    const testimonials: Testimonial[] = [
        {
            quote: "This platform has revolutionized my medical practice. The ability to manage prescriptions digitally and communicate with patients seamlessly has reduced administrative time by 50%. The appointment scheduling feature is particularly impressive.",
            author: "Dr. Sarah Chen",
            role: "Primary Care Physician",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
        },
        {
            quote: "Finding the right specialist used to be a challenge. Thanks to this system, I was able to locate a cardiologist, read verified reviews, and book an appointment all in one place. The prescription tracking feature gives me peace of mind.",
            author: "Michael Rodriguez",
            role: "Patient",
            photo: "https://thumbs.dreamstime.com/b/portrait-young-female-software-developer-busy-startup-office-her-multiethnic-business-team-background-142183584.jpg"
        },
        {
            quote: "As a busy pediatrician, having all my patient records, prescriptions, and appointments in one integrated system is invaluable. The automated reminder system has significantly reduced no-shows at my practice.",
            author: "Dr. James Wilson",
            role: "Pediatrician",
            photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1980&q=80"
        },
        {
            quote: "Managing my family's healthcare has never been easier. I can schedule appointments for my children, track their prescriptions, and communicate with their doctors all through one platform. It's a game-changer for busy parents.",
            author: "Emily Thompson",
            role: "Patient & Parent",
            photo: "https://img.freepik.com/free-photo/front-view-smiley-business-man_23-2148479583.jpg?t=st=1724422909~exp=1724426509~hmac=dbbbe6ba54c4c4fd7201076106decb3439f1beb48102a69ce2880283680ee650&w=826",
        },
        {
            quote: "The prescription management system is exceptional. I can easily monitor patient compliance, send digital prescriptions, and receive alerts about potential drug interactions. It's greatly improved patient safety in my practice.",
            author: "Dr. Aisha Patel",
            role: "Internal Medicine Specialist",
            photo: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
        },
        {
            quote: "This platform has completely transformed my workflow. The integration of digital prescriptions, appointment scheduling, and patient communication in one place has been a huge time-saver. I highly recommend it to any healthcare professional.",
            author: "Dr. John Doe",
            role: "Surgeon",
            photo: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1724422719~exp=1724426319~hmac=0ef6c552041a747907df66c476c3e7785bd05b39e09c2f54fa04367876376dfa&w=996",
        }
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                        Trusted by Healthcare Professionals & Patients
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                        See how our platform is transforming healthcare management for both doctors and patients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center text-center transform transition duration-300 hover:shadow-2xl hover:-translate-y-1"
                        >
                            <div className="relative">
                                <img
                                    src={testimonial.photo}
                                    alt={`${testimonial.author}'s profile`}
                                    className="w-24 h-24 rounded-full mb-6 shadow-lg object-cover border-4 border-blue-100"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                                    <FaQuoteLeft className="text-white h-4 w-4" />
                                </div>
                            </div>

                            <p className="text-lg text-gray-700 mb-6 leading-relaxed min-h-[150px]">
                                {testimonial.quote}
                            </p>

                            <div className="mt-auto">
                                <div className="w-12 h-[2px] bg-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-800 font-semibold text-lg">{testimonial.author}</p>
                                <p className="text-blue-600 font-medium">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl">
                        View More Testimonials
                    </button>
                </div>
            </div>
        </div>
    );
}