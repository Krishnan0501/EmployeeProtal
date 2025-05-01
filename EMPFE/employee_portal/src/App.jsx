import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Pages/Navbar";
import { Sidebar } from "./Pages/SideBar";
import { MainContent } from "./Pages/Main_content";
import { Login } from "./Pages/Login";
import AddRole from "./Pages/Components/Addrole";
import EditRole from "./Pages/Components/EditRole";
import { ChangePassword } from "./Pages/ChangePassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  const [activeSection, setActiveSection] = useState("DASHBOARD");
  useEffect(() => {
    const Data = JSON.parse(sessionStorage.getItem("EmployeeData"));
    // console.log("Data----------", Data);

    if (Data && Data.roleId !== 3) {
      setActiveSection("TIMESHEET ENTRY");
      // console.log("activeSection", activeSection);
    }
  }, [isLoggedIn]);
  const [credintial, setCredintial] = useState({
    emailId: "",
    password: "",
  });
  const [employeeData, setEmployeeData] = useState(null);
  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("token");
  };
  useEffect(() => {
    const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    const entityId = employeeData?.entityId;
    const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | ${entityName}`;
  }, []);
  return (
    <Router>
      <Routes>
        {/* Show Login & Change Password when NOT logged in */}
        {!isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <Login
                  setEmployeeData={setEmployeeData}
                  onLoginSuccess={handleLoginSuccess}
                  credintial={credintial}
                  setCredintial={setCredintial}
                />
              }
            />
            <Route
              path="/change-password/:password"
              element={
                <ChangePassword
                  onLoginSuccess={handleLoginSuccess}
                  credintial={credintial}
                  setCredintial={setCredintial}
                />
              }
            />
          </>
        ) : (
          <Route
            path="*"
            element={
              <AppLayout
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={handleLogout}
                employeeData={employeeData}
              />
            }
          />
        )}
      </Routes>
    </Router>
  );
}

// ✅ Optimized Layout Component
function AppLayout({
  activeSection,
  setActiveSection,
  onLogout,
  employeeData,
}) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="app-container">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {/* Match all authenticated routes */}
        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                activeSection={activeSection}
                employeeData={employeeData}
              />
            }
          />
          <Route path="/roles/add" element={<AddRole />} />
          <Route path="/roles/:operation/:roleId" element={<EditRole />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
