import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMenuData } from '../utils/slices/permissionSlice';



const MenuMaster = () => {
    const dispatch = useDispatch();
    const { menuItems, status, error } = useSelector((state) => state.permissions);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        dispatch(fetchMenuData());
    }, [dispatch]);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const renderMenuItem = (item, index) => {
        const hasPermission = (permission) => {
            return true;
        };

        return (
            <li key={index}>
                {item.children ? (
                    <>
                        <button
                            onClick={() => toggleDropdown(item.name)}
                            className="text-sm hover:text-base-content hover:bg-base-200 px-4 py-2 flex items-center w-full text-left"
                        >
                            {item.name}
                            <svg
                                className={`h-6 w-6 ml-auto transition-transform ${openDropdownId === item.name ? 'transform rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M6 8l4 4 4-4H6z" />
                            </svg>
                        </button>
                        {openDropdownId === item.name && (
                            <ul className="pl-8 mt-2 space-y-2">
                                {item.children
                                    .filter(child => hasPermission(child.permission))
                                    .map((child, childIndex) => (
                                        <li key={childIndex}>
                                            <Link to={child.url} className="text-sm hover:text-base-content hover:bg-base-200 px-4 py-2 flex items-center">
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </>
                ) : (
                    hasPermission(item.permission) && (
                        <Link to={item.url} className="text-sm hover:text-black hover:bg-gray-300 px-4 py-2 flex items-center">
                            {item.name}
                        </Link>
                    )
                )}
            </li>
        );
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;

    return (
        <ul className="space-y-2">
            {Array.isArray(menuItems) ? (
            menuItems.map((item, index) => renderMenuItem(item, index))
        ) : (
            <p>No menu items available.</p>
        )}
        </ul>
    );
}

export default MenuMaster;
