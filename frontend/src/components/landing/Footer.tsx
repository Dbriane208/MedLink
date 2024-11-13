import { CgFacebook } from "react-icons/cg"; 
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs"; 
import { SlArrowUp } from "react-icons/sl"; 

const ResponsiveFooter = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Your Trusted Health Partner
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We help connect patients with the right doctors and manage healthcare seamlessly, anytime, anywhere.
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <CgFacebook className="text-2xl text-blue-600 hover:text-blue-800" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <BsInstagram className="text-2xl text-blue-600 hover:text-blue-800" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <BsLinkedin className="text-2xl text-blue-600 hover:text-blue-800" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <BsTwitter className="text-2xl text-blue-600 hover:text-blue-800" />
          </a>
        </div>

        <div className="border-t-2 border-gray-200 py-4 text-center">
          <p className="text-gray-500 text-sm">© 2021 MedLink. All Rights Reserved.</p>
          <p className="text-sm text-gray-500">
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a>
          </p>
        </div>

        <div className="absolute bottom-4 right-4">
          <a href="#top" className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700">
            <SlArrowUp className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default ResponsiveFooter;
