import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaUsers,
  FaBuilding,
  FaUserClock,
  FaChartBar, FaFileDownload
} from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import "./Home.css";

export const Sidebar = ({ setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("DASHBOARD");
  const navigate = useNavigate();

  const emp = JSON.parse(sessionStorage.getItem("EmployeeData"));
  const allowedScreens = emp?.screenAccess || [];

  const screenOrder = useMemo(() => [
    "DASHBOARD",
    "TIMESHEET ENTRY",
    "TEAM TIMESHEET",
    "REPORTS",
  ], []);

  const iconMap = useMemo(() => ({
    "REPORTS": <FaDownload className="icon" />,
    "TEAM TIMESHEET": <FaUsers className="icon" />,
    "TIMESHEET ENTRY": <FaUserClock className="icon" />,
    "DASHBOARD": <FaChartBar className="icon" />
  }), []);

  const sortedScreens = useMemo(() => (
    allowedScreens.sort(
      (a, b) => screenOrder.indexOf(a.type) - screenOrder.indexOf(b.type)
    )
  ), [allowedScreens, screenOrder]);

  const handleItemClick = (sectionName) => {
    setActiveItem(sectionName);
    setActiveSection(sectionName);
    navigate("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button
        className="collapse-btn"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <FaChevronLeft className={`toggle-icon ${isOpen ? "rotate" : ""}`} />
      </button>

      <ul className="sidebar-links">
        {sortedScreens.map(({ type, id }) => (
          <li
            key={id}
            className={`sidebar-ele ${activeItem === type ? "yellow" : ""}`}
            onClick={() => handleItemClick(type)}
          >
            {iconMap[type] || <FaBuilding className="icon" />}
            {isOpen && <span className="ele">{type}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
