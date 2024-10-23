import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Logo from './image/logo.png';
import CheckToken from "../Component/token/checktoken";
import getToken from "../Component/token/gettoken";

const Navbar = ({ buttons, activeButton, onButtonClick, profileName, profilePicture }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [token, updateToken] = useState(null);
  const [ProfileImg, setProfileImg] = useState("");
  const [ProfileName, setProfileName] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

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
    setProfileName(token ? token.name : "User");
  }, [navigate]);

  const handleNavigation = (buttonName) => {
    const routes = {
      "Dashboard": "/",
      "User": "/list-user",
      "Leads": "/lead-list",
      "Booking": "/booking",
      "Clients": "/client-list",
      "Invoice": "/invoice",
      "Purchase Order": "/purchase-list",
      "Transport": "/transport-list",
      "Calendar": "/calendar",
      "Settings": "/settings",
      "Sign Out": "/sign-out",
      "Products":'/product'
    };

    const path = routes[buttonName];
    if (path) {
      navigate(path);
      onButtonClick(buttonName);
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Logo that toggles mobile menu */}
      <img 
        src={Logo} 
        alt="Logo" 
        className="h-12 cursor-pointer md:h-20" 
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} // Toggle mobile menu
      />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        {buttons.map((buttonName) => (
          <button
            key={buttonName}
            className={`${activeButton === buttonName ? "bg-gray-950 text-white" : ""
              } font-semibold px-3 py-2 rounded`}
            onClick={() => handleNavigation(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </nav>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden flex flex-col space-y-4 py-4">
          {buttons.map((buttonName) => (
            <button
              key={buttonName}
              className={`${activeButton === buttonName ? "bg-purple-700 text-white" : ""
                } font-semibold px-4 py-2 text-left`}
              onClick={() => handleNavigation(buttonName)}
            >
              {buttonName}
            </button>
          ))}
        </nav>
      )}

      {/* Profile Section */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold hidden md:block">{ProfileName}</span>
        <img src={ProfileImg} alt="Profile" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
};

export default Navbar;
