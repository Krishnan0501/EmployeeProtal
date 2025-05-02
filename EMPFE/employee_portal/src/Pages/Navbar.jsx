import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaRegFileAlt,
  FaQuestionCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import iagamiLogo from "../assets/Iagami.png"; // Correct way to import images in Vite/React
import bsecLogo from "../assets/Logob.png"; // Correct way to import images in Vite/React
import "./Home.css"; // Assuming Home.css contains navbar styles

export const Navbar = ({ onLogout }) => {
  const emp = JSON.parse(sessionStorage.getItem("EmployeeData"));
  
  const navigate = useNavigate(); // ✅ add this line

  return (
    <div className="navbar">
      {/* Logo and Title */}
      <div className="logo-c">
        {emp.entityId === 2 ? (
          <img src={iagamiLogo} alt="Logo" className="logo" width={100} />
        ) : (
          <img src={bsecLogo} alt="Logo" className="logo" width={100} />
        )}
        {/* <h2>HarvestEye</h2> */}
      </div>

      {/* Navigation Icons */}
      <ul className="nav-links">
        {/* <li className="nav-item" title="Files">
          <FaRegFileAlt className="icon" />
        </li>
        <li className="nav-item" title="Help">
          <FaQuestionCircle className="icon" />
        </li> */}
        <li className="nav-item" title="Profile" onClick={() => navigate("/profile")}>
          <FaUser className="icon" />
        </li>
        <li className="nav-item logout" title="Logout" onClick={onLogout}>
          <FaSignOutAlt className="icon" />
        </li>
      </ul>
    </div>
  );
};
