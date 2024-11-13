const Welcome = () => {
    return (
        <div className="relative h-screen w-screen bg-gradient-to-b from-white flex items-center justify-center">
            {/* Background image */}
            <div className="absolute inset-0 h-screen w-screen">
                <img 
                    src="/medlink.jpeg" 
                    alt="Medical consultation" 
                    className="w-full h-full object-cover"
                />
                {/* Optional overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-white/50"></div>
            </div>

            {/* Text overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Expert Health Consultations Anytime, Anywhere
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mt-4">
                    Access top-tier health consultations from the comfort of your home or on the go. Our
                    platform connects you with experienced medical professionals around the clock.
                </p>
            </div>
        </div>
    );
}

export default Welcome;