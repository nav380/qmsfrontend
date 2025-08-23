import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import DjangoConfig from "../config/Config";
import dummyuser from "../assets/images/dummy-user.png";
import { GrMenu } from "react-icons/gr";
import logo from "../assets/images/logo.jpg";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({});
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userDetail = async () => {
    try {
      const url = `${DjangoConfig.apiUrl}/rtqm/user_detail`;
      const response = await axios.get(url, { withCredentials: true });
      console.log(response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    userDetail();
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const handleClick = () => {
    window.location.href = "http://61.246.37.197:12001/";
  };
  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <header className="drawer drawer-end bg-white">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content w-full text-base-content bg-base-100">
        <div className="w-full navbar bg-base-100 h-10">
          <div className="flex-none mt-2">
            <button
              onClick={toggleSidebar}
              className="rounded-full p-3 hover:bg-base-200"
            >
              <GrMenu className="text-xl text-gray-500" />
            </button>
          </div>

          <div className="flex-1 mx-2 bg-base-100 flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="w-7 h-7 cursor-pointer"
              onClick={handleClick}
            />
            <h1
              className="bg-gradient-to-r from-rose-600 via-yellow-500 to-blue-500 text-transparent bg-clip-text text-lg font-bold mt-2 ml-2 cursor-pointer"
              onClick={handleClick}
            >
              IntelliSYNC
            </h1>
          </div>
          <div className="flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* <li><Link to="/">Item</Link></li> */}
              <li>
                <label
                  className="swap swap-rotate p-2 mt-2 rounded-full"
                  onChange={handleToggle}
                >
                  <input
                    type="checkbox"
                    className="theme-controller"
                    value="synthwave"
                  />
                  <svg
                    className="swap-off fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                  <svg
                    className="swap-on fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>
              </li>
              <li>
                <Link to="/dashboard">
                  <div className="dropdown dropdown-end flex items-center">
                    {/* Image button */}
                    <div className="flex items-center">
                      <img
                        src={dummyuser} // Replace with your image path
                        alt="User Profile"
                        className="w-8 h-8 rounded-full m-1 cursor-pointer"
                        title="User Profile"
                      />
                    </div>

                    {/* User information */}
                    <div className="ml-2">
                      {userData && userData.username ? (
                        <p className="text-base font-medium">
                          {userData.full_name}
                        </p>
                      ) : (
                        <p className="text-base text-gray-500">Not logged in</p>
                      )}
                    </div>

                    {/* Icon button to toggle dropdown */}
                    <div className="dropdown dropdown-end ml-2">
                      {/* Dropdown content */}
                      <ul>
                        {userData && userData.username && (
                          <li>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={handleClick}
                            >
                              {/* Logout icon */}
                              Logout
                            </button>
                          </li>
                        )}
                      </ul>{" "}
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-grow ">
          {" "}
          {/* Sidebar */}
          <div className="w-50 flex-shrink-0  rounded-lg text-black">
            <Sidebar isOpen={isSidebarOpen} />
          </div>
          {/* Main Content */}
          <div className="flex-grow py-1 px-3 overflow-x-auto bg-base-200 text-base-content rounded-md">
            <Outlet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
