// TopBar.js
import React, { useEffect, useState } from 'react';
import getToken from '../token/gettoken';
import CheckToken from '../token/checktoken';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [token, updateToken] = useState(null);
  const [ProfileImg, setProfileImg] = useState("")
  const [ProfileName, setProfileName] = useState("")
  const navigate = useNavigate(); // Initialize the useNavigate hook


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
    )
    setProfileName(token
      ? token.name
      : "User"
    )
  }, []);

  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex items-center">
        <img src={ProfileImg} alt="User" className="w-10 h-10 rounded-full mr-2" />
        <span>{ProfileName}</span>
      </div>
    </div>
  );
};

export default TopBar;
