import React from "react";
import "./Home.css";
import { TablePage } from "./TablePage";
import { Table2 } from "./Table2";
import TimesheetSelection from "./Components/Timesheetselection";
import { TeamTimeSheet } from "./Components/TeamTimeSheet";
import { EmployeesTimeSheet } from "./Components/EmployeesTimeSheet";
import { DownloadPage } from "./DownloadPage";
import { DashboardPage } from "./Dashboard";

export const MainContent = ({ activeSection, employeeData }) => {
  const emp = JSON.parse(sessionStorage.getItem("EmployeeData"));
  const allowedScreens = emp?.screenAccess || [];

  // 🔍 Debug logs
  // console.log("Current activeSection:", activeSection);
  // console.log("User's allowed screens:", allowedScreens);

  const screenComponentMap = {
    "REPORTS": {
      component: <DownloadPage />,
      requiredId: 3,
      testId: "employee-timesheet",
    },
    "TEAM TIMESHEET": {
      component: <TeamTimeSheet employeeData={employeeData} />,
      requiredId: 2,
      testId: "team-timesheet",
    },
    "TIMESHEET ENTRY": {
      component: <TimesheetSelection employeeData={employeeData} />,
      requiredId: 1,
      testId: "timesheet-entry",
    },
    "DASHBOARD": {
      component: <DashboardPage />,
      requiredId: 4,
      testId: "dashboard",
    },
  };

  const hasAccessTo = (screenType) => {
    const hasAccess = allowedScreens.some(
      (screen) =>
        screen.type === screenType &&
        screen.id === screenComponentMap[screenType]?.requiredId
    );
    // console.log(`Access check for ${screenType}:`, hasAccess);
    return hasAccess;
  };

  return (
    <div className="main-content">
      {/* Hidden info for testing */}
      <div style={{ display: "none" }} data-testid="active-section">
        Current: {activeSection}
      </div>

      {/* Static sections */}
      {/* {activeSection === "EmployeeRoles" && <Table2 />}
      {activeSection === "Departments" && <TablePage />}
      {activeSection === "EmployeeDesigination" && (
        <p>Manage employee designations.</p>
      )} */}

      {/* Dynamic sections */}
      {Object.entries(screenComponentMap).map(([screenType, config]) => {
        const shouldRender =
          activeSection === screenType && hasAccessTo(screenType);

        if (shouldRender) {
          console.log("Rendering component for:", screenType);
        }

        return shouldRender ? (
          <React.Fragment key={config.testId}>
            {config.component}
          </React.Fragment>
        ) : null;
      })}

      {/* Access denied */}
      {activeSection &&
        screenComponentMap[activeSection] && // Only if the section is in the map
        !hasAccessTo(activeSection) && (
          <div className="access-denied">
            ⛔ No access to {activeSection.replace(/_/g, " ")}
          </div>
        )}

      {/* Nothing selected */}
      {!activeSection && (
        <div className="welcome-message">👋 Please select a section</div>
      )}
    </div>
  );
};
