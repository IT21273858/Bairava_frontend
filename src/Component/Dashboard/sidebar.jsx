import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { AiFillProduct, AiOutlineMenu } from 'react-icons/ai'; // Import a hamburger menu icon
import getToken from '../token/gettoken';
import CheckToken from '../token/checktoken';
import Logo from '../../Utils/image/logo.png';
import Cookies from "js-cookie";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Initially closed on mobile
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [token, updateToken] = useState(null);
  const [ProfileImg, setProfileImg] = useState("");
  const [ProfileName, setProfileName] = useState("");

  useEffect(() => {
    if (!CheckToken()) {
      navigate("/login");
      return;
    }

    const token = getToken();
    if (token) {
      updateToken(token);
    }

    setProfileImg(token
      ? token.img
      : "https://i.pinimg.com/564x/88/32/f7/8832f793b10a24f547d6a55b4ac8ac67.jpg"
    );
    setProfileName(token
      ? token.name
      : "User"
    );
  }, [navigate]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
    if (path === '/sign-out') {
      Cookies.remove('token');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden p-4">
        <AiOutlineMenu className="text-2xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div
        className={`fixed inset-y-0 left-0 bg-white p-5 ${isOpen ? "block" : "hidden"} md:block w-55 duration-300 z-50`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col items-center w-40">
          {/* Logo */}
          <img
            src={Logo}
            alt="Logo"
            className="cursor-pointer w-18 h-18 mb-4"
            onClick={toggleSidebar}  // Toggles the sidebar when clicked
          />

          {/* User info */}
          <div className="text-center">
            <img
              src={ProfileImg}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-lg font-semibold mt-2">{ProfileName}</h2>
          </div>

          {/* Navigation items */}
          <ul className="mt-5 space-y-3">
            <li
              className="flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md"
              onClick={() => handleNavigation('/')}
            >
              <span className="text-lg">🏠</span>
              <span className="text-md">Dashboard</span>
            </li>
            {/* <li
              className="flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md"
              onClick={() => handleNavigation('/list-user')}
            >
              <span className="text-lg">👤</span>
              <span className="text-md">User Profile</span>
            </li> */}
            <li
              className="flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md"
              onClick={() => handleNavigation('/product')}
            >
              <span className="text-lg">{ <AiFillProduct />} </span>
              <span className="text-md">Products</span>
            </li>
            <li
              className="flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md"
              onClick={() => handleNavigation('/sign-out')}
            >
              <span className="text-lg">🚪</span>
              <span className="text-md">Sign Out</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
