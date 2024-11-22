import {IoIosSearch} from "react-icons/io";

const ResponsiveSearchbar = () => {

    return (
        <div className="relative w-full sm:w-[80%] product_search_input">
            <input className="px-4 py-2 border border-border rounded-md w-full pl-[40px] outline-none"
                   placeholder="Search..." />
            <IoIosSearch className="absolute top-[9px] left-2 text-[1.5rem] text-[#adadad]"/>
        </div>
    );
};

export default ResponsiveSearchbar;
                    