/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { BsChevronLeft, BsChevronRight, BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { getAllUsers } from "../../api/Api";
import { useMutation } from "@tanstack/react-query";
import { handleAxiosError } from "../../utils/AxiosError";
import { User } from "../../api/ModelInterfaces";
import DoctorTable from "./DoctorTable";
import AppointmentsTable from "./AppointmentsTable";

const AdminTable = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: 'asc' | 'desc' }>({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Fetch users
    const { mutate: fetchUsers } = useMutation({
        mutationFn: getAllUsers,
        onSuccess: (data: any) => {
            const usersArray = Array.isArray(data) ? data :
                (data?.data ? (Array.isArray(data.data) ? data.data : []) : []);

            if (usersArray.length > 0) {
                setUsers(usersArray);
                setError(null);
            } else {
                setError("No users found");
            }
            setLoading(false);
        },
        onError: (error: any) => {
            const errData = handleAxiosError(error);
            const errorMessage = typeof errData === "string" ? errData : "An unknown error occurred.";
            setError(errorMessage);
            setLoading(false);
        }
    });

    useEffect(() => {
        setLoading(true);
        fetchUsers();
    }, [fetchUsers]);

    // Handle search
    const filteredData = useMemo(() => {
        return users.filter(user =>
            Object.entries(user).some(([key, value]) => {
                // Only search through specific fields
                if (['name', 'email'].includes(key) && value) {
                    return value.toString().toLowerCase().includes(search.toLowerCase());
                }
                return false;
            })
        );
    }, [users, search]);

    // Handle sort
    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (!aValue || !bValue) return 0;

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    const handleOptionClick = (value: number) => {
        setPageSize(value);
        setCurrentPage(1);
        setIsOpen(false);
    };

    const toggleActionMenu = (id: number) => {
        setOpenActionMenuId(openActionMenuId === id ? null : id);
    };

    const handleToggle = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                    <input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm py-2.5 px-4 border border-gray-200 rounded-md outline-none focus:border-blue-300"
                    />
                </div>

                <div className="rounded-md border border-gray-200 w-full">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left font-medium text-gray-700">Profile</th>
                                <th
                                    className="p-3 text-left font-medium text-gray-700 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-[5px]">
                                        Name
                                        <HiOutlineArrowsUpDown className="hover:bg-gray-200 p-[5px] rounded-md text-[1.6rem]" />
                                    </div>
                                </th>
                                <th
                                    className="p-3 text-left font-medium text-gray-700 cursor-pointer"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-[5px]">
                                        Email
                                        <HiOutlineArrowsUpDown className="hover:bg-gray-200 p-[5px] rounded-md text-[1.6rem]" />
                                    </div>
                                </th>
                                <th className="p-3 text-left font-medium text-gray-700">Created At</th>
                                <th className="p-3 text-left font-medium text-gray-700">Updated At</th>
                                <th className="p-3 text-left font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((user) => (
                                <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                                     <td className="p-3">
                                        <img 
                                            src={user.profilePic} 
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="p-3 text-black">{user.name}</td>
                                    <td className="p-3 text-black">{user.email}</td>
                                    <td className="p-3 text-black">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-black">
                                        {new Date(user.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 relative">
                                        <BsThreeDotsVertical
                                            onClick={() => toggleActionMenu(user.id)}
                                            className="action-btn text-gray-600 cursor-pointer"
                                        />

                                        <div className={`${openActionMenuId === user.id ? "opacity-100 scale-[1] z-30" : "opacity-0 scale-[0.8] z-[-1]"} zenui-table absolute top-[90%] right-[80%] p-1.5 rounded-md bg-white shadow-md min-w-[160px] transition-all duration-100`}>
                                            <p className="flex items-center gap-[8px] text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                                <MdOutlineEdit />
                                                Edit
                                            </p>
                                            <p className="flex items-center gap-[8px] text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                                <MdDeleteOutline />
                                                Delete
                                            </p>
                                            <p className="flex items-center gap-[8px] text-[0.9rem] py-1.5 px-2 w-full rounded-md text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                                                <IoEyeOutline />
                                                View Details
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!paginatedData?.length && (
                        <p className="text-[0.9rem] text-gray-500 py-6 text-center w-full">
                            No users found!
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                        <div className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                        </div>

                        <div ref={selectRef} className="relative w-44">
                            <button
                                onClick={handleToggle}
                                className="w-max px-2 py-0.5 text-left text-black bg-white border border-gray-300 rounded shadow-sm flex items-center justify-between gap-[10px] hover:border-gray-400 focus:outline-none"
                            >
                                {pageSize}
                                <IoIosArrowDown className={`${isOpen ? "rotate-[180deg]" : "rotate-0"} transition-all text-black duration-200`} />
                            </button>
                            {isOpen && (
                                <div className="absolute w-max mt-1 bg-white border text-black border-gray-300 rounded shadow-lg">
                                    {[5, 10, 20, 50].map((size) => (
                                        <div
                                            key={size}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleOptionClick(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border border-gray-200 hover:bg-gray-50 cursor-pointer px-[10px] text-[0.9rem] py-[5px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <BsChevronLeft />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`${pageNum === currentPage ? "bg-black text-white" : ""} border border-gray-200 px-[10px] text-[0.9rem] py-[1px] rounded-md`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="border border-gray-200 px-[10px] cursor-pointer hover:bg-gray-50 text-[0.9rem] py-[5px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <BsChevronRight />
                        </button>
                    </div>
                </div>
            </div>
            <DoctorTable/>
            <AppointmentsTable/>
        </div>
    );
};



export default AdminTable;