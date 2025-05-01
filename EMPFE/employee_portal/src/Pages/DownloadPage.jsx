import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  styled,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getEmployees,
  postDownload,
  getProjectForDownload,
  postDownloadProjectReport,
  postDownloadProductionHours,
} from "../Pages/api.js";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// Custom styled Accordion
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  "&:hover": {},
  "&.Mui-expanded": {
    margin: "16px 0",
  },
  margin: "8px 0",
  borderRadius: "8px",
  overflow: "hidden",
}));

// Custom styled AccordionSummary
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  "&:hover": {
    transform: "none",
  },
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    transition: "none",
  },
  "& .MuiTypography-root": {
    transform: "none !important",
    transition: "none !important",
  },
}));

export const DownloadPage = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const userId = sessionStorage.getItem("employeeId");
  const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
  const employeeRoleId = employeeData?.roleId;

  const [projectId, setProjectId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [projectList, setProjectList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i);

  const fetchEployees = async (id) => {
    console.log("Fetching employees for ID:", id);
    try {
      const data = await getEmployees(id);
      setEmployeeList(data.data);
      console.log("Entities : ", data.data);
    } catch (error) {
      // showPopup("Unable to fetch entities");
      console.error("Error fetching entities:", error);
    }
  };
  const fetchProjects = async (id) => {
    try {
      const data = await getProjectForDownload(id);
      setProjectList(data.data);

      console.log("Projects : ", data.data);
    } catch (error) {
      // showPopup("Unable to fetch entities");
      console.error("Error fetching Projects :", error);
    }
  };
  useEffect(() => {
    fetchEployees(userId);
    fetchProjects(userId);
    const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    const entityId = employeeData?.entityId;
    const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | ${entityName} | Reports`;
    console.log("APi hitted");
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleDownload = async (type) => {
    let payload;
    let apiCall;

    try {
      if (type === "project") {
        payload = { projectId, year, month };
        apiCall = postDownloadProjectReport;
      } else if (type === "role") {
        payload = { roleId: employeeRoleId, year, month };
        apiCall = postDownloadProductionHours;
      } else if (type === "employee") {
        payload = { employeeId: employeeIds, year, month };
        apiCall = postDownload;
      }

      await apiCall(payload);

      setSnackbar({
        open: true,
        message: "File downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Download error:", error);
      setSnackbar({
        open: true,
        message: "Download failed: " + (error?.message || "Unknown error"),
        severity: "error",
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 5 }}>
        Download Reports
      </Typography>

      {/* Projectwise */}
      <StyledAccordion
        expanded={expandedAccordion === "project"}
        onChange={handleAccordionChange("project")}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Project Report</Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/* Project Dropdown */}
            <Grid item xs={4}>
              <TextField
                select
                label="Project"
                fullWidth
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projectList.map((p) => (
                  <MenuItem key={p.projectId} value={p.projectId}>
                    {p.clientName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Month Dropdown */}
            <Grid item xs={4}>
              <Autocomplete
                size="small"
                fullWidth
                options={months}
                value={months[month - 1]} // Maps month number to month name
                onChange={(event, newValue) => {
                  const selectedMonth = months.indexOf(newValue) + 1; // Convert month name to number
                  setMonth(selectedMonth);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Month" />
                )}
              />
            </Grid>

            {/* Year Dropdown */}
            <Grid item xs={4}>
              <Autocomplete
                size="small"
                fullWidth
                options={years}
                value={year}
                onChange={(event, newValue) => {
                  const selectedYear = Number(newValue); // Convert selected year to integer
                  setYear(selectedYear);
                  setRequest((prev) => ({
                    ...prev,
                    year: selectedYear, // Store as an integer in the request
                  }));
                }}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => <TextField {...params} label="Year" />}
              />
            </Grid>
            {/* Download Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleDownload("project")}
                sx={{ minWidth: 120 }}
              >
                Download
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </StyledAccordion>

      {/* Rolewise */}
      {JSON.parse(sessionStorage.getItem("EmployeeData")).roleId == 3 && (
        <StyledAccordion
          expanded={expandedAccordion === "role"}
          onChange={handleAccordionChange("role")}
        >
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              Entity Production Hours{" "}
            </Typography>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* <Grid item xs={4}>
              <TextField
                select
                label="Role"
                fullWidth
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                {roleList.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

              {/* Month Dropdown */}
              <Grid item xs={4}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={months}
                  value={months[month - 1]} // Maps month number to month name
                  onChange={(event, newValue) => {
                    const selectedMonth = months.indexOf(newValue) + 1; // Convert month name to number
                    setMonth(selectedMonth);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Month" />
                  )}
                />
              </Grid>
              {/* Year Dropdown */}
              <Grid item xs={4}>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={years}
                  value={year}
                  onChange={(event, newValue) => {
                    const selectedYear = Number(newValue); // Convert selected year to integer
                    setYear(selectedYear);
                    setRequest((prev) => ({
                      ...prev,
                      year: selectedYear, // Store as an integer in the request
                    }));
                  }}
                  getOptionLabel={(option) => option.toString()}
                  renderInput={(params) => (
                    <TextField {...params} label="Year" />
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleDownload("role")}
                  sx={{ minWidth: 120 }}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </StyledAccordion>
      )}

      {/* Employee-wise */}
      <StyledAccordion
        expanded={expandedAccordion === "employee"}
        onChange={handleAccordionChange("employee")}
      >
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Employee Report</Typography>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={[
                  { firstName: "Select All", employeeId: "all" },
                  ...employeeList,
                ]}
                getOptionLabel={(option) => option.firstName}
                value={
                  employeeIds.includes("all")
                    ? employeeList // if "all" selected, show all employees
                    : employeeList.filter((emp) =>
                        employeeIds.includes(emp.employeeId)
                      )
                }
                onChange={(event, newValue) => {
                  if (newValue.some((option) => option.employeeId === "all")) {
                    if (employeeIds.length === employeeList.length) {
                      // Deselect All
                      setEmployeeIds([]);
                    } else {
                      // Select All
                      setEmployeeIds(employeeList.map((emp) => emp.employeeId));
                    }
                  } else {
                    setEmployeeIds(newValue.map((emp) => emp.employeeId));
                  }
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={
                        option.employeeId === "all"
                          ? employeeIds.length === employeeList.length
                          : employeeIds.includes(option.employeeId)
                      }
                    />
                    {option.firstName}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Employees" fullWidth />
                )}
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) =>
                  option.employeeId === value.employeeId
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                size="small"
                fullWidth
                options={months}
                value={months[month - 1]} // Maps month number to month name
                onChange={(event, newValue) => {
                  const selectedMonth = months.indexOf(newValue) + 1; // Convert month name to number
                  setMonth(selectedMonth);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Month" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                size="small"
                fullWidth
                options={years}
                value={year}
                onChange={(event, newValue) => {
                  setYear(newValue);
                  setRequest((prev) => ({
                    ...prev,
                    year: newValue,
                  }));
                }}
                getOptionLabel={(option) => option.toString()} // 🔥 THIS FIXES THE ERROR
                renderInput={(params) => <TextField {...params} label="Year" />}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleDownload("employee")}
                sx={{ minWidth: 120 }}
              >
                Download
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </StyledAccordion>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
