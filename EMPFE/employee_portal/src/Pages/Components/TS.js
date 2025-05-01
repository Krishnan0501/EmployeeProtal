import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  Tabs,
  Tab,
  Dialog,
  Autocomplete,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import {
  getEntities,
  getProjects,
  getTech,
  postResponse,
  getTaskupdates,
} from "../../Pages/api.js";
import { MonthlyTimeSheet } from "./MonthlyTimeSheet.jsx";

// ✅ Styled Table Row (Zebra Stripes)
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#e0f7fa",
    cursor: "pointer",
  },
}));

// ✅ Styled Table Header Cell (Purple Header)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#842988",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    padding: "5px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "left",
    padding: "5px",
  },
}));
const textFieldStyles = {
  "& .MuiInputBase-root": {
    height: "30px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    padding: "5px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#842988",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6200ea",
  },
};

export const TimesheetSelection = ({ employeeData }) => {
  const userId = employeeData.employeeId;
  // const userId = 1;

  // const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entities, setEntities] = useState([]);
  const [response, setResponse] = useState([]);
  const [updatedResponse, setUpdatedResponse] = useState([
    {
      entity: "",
      workId: "",
      project: "",
      technology: "",
      status: "",
      details: "",
      duration: "",
      statusCode: "SM",
    },
  ]);
  const [totalHours, setTotalHours] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [header, setHeader] = useState("Success!");
  const ind = response.length;
  const defaultdropdownvalue = "INPROGRESS";
  console.log("defaultdropdownvalue", defaultdropdownvalue);

  const [entries, setEntries] = useState([
    {
      entity: "",
      project: "",
      technology: "",
      status: "",
      details: "",
      duration: "",
      projects: [],
      technologies: [],
      statusCode: "SM",
    },
  ]);

  const fetchEntity = async () => {
    try {
      const data = await getEntities();
      setEntities(data.data);
    } catch (error) {
      // showPopup("Unable to fetch entities");
      console.error("Error fetching entities:", error);
    }
  };

  const fetchTaskUpdates = async (userId) => {
    try {
      const data = await getTaskupdates(userId);
      console.log("✅ API Response:", data);

      if (data?.responseCode === "200" && Array.isArray(data.data)) {
        setResponse(data.data);
        console.log("✅ Timesheet Data:", data.data);
      } else {
        console.warn("⚠️ No timesheet records found for today.");
        setResponse([]); // Set empty array instead of null
      }
    } catch (error) {
      console.error("❌ Failed to fetch task updates:", error.message);
      setResponse([]); // Ensure response is never null
    }
  };

  const fetchProjects = async (index, entityId) => {
    if (!entityId) return;
    try {
      const data = await getProjects(entityId);
      if (data?.data?.length) {
        const updatedEntries = [...entries];
        updatedEntries[index].projects = data.data;
        setEntries(updatedEntries);
      }
    } catch (error) {
      // showPopup("Unable to fetch projects");
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTech = async (index, projectId) => {
    if (!projectId) return;
    try {
      const data = await getTech(projectId);
      if (data?.data?.length) {
        const updatedEntries = [...entries];
        updatedEntries[index].technologies = data.data;
        setEntries(updatedEntries);
      }
    } catch (error) {
      // showPopup("Unable to fetch Technologies");
      console.error("Error fetching technologies:", error);
    }
  };

  useEffect(() => {
    fetchEntity();
    fetchTaskUpdates(userId);
  }, []);

  useEffect(() => {
    console.log("Entities Updated: ", entities);
  }, [entities]);

  const transformEntriesToResponse = async (entries) => {
    const formattedResponse = entries.map((entry) => ({
      userId: userId,
      entityId: entry.entity,
      projectId: entry.project,
      technologyId: entry.technology,
      taskStatus: entry.status || "1", // Default to "Inprogress" if not set
      description: entry.details,
      duration: entry.duration,
      statusCode: "SM",
    }));
    // setResponse(formattedResponse);

    await postResponse(formattedResponse);
    // console.log(typeof response);
  };
  useEffect(() => {
    console.log("🔍 Response Data: ", response);
    if (Array.isArray(response) && response.length > 0) {
      const total = response.reduce(
        (sum, data) => sum + (parseFloat(data.duration) || 0),
        0
      );

      setTotalHours(parseFloat(total.toFixed(1))); // ✅ Round to 1 decimal place
      console.log("✅ Total Hours (API):", total.toFixed(1));
    } else {
      setTotalHours(0);
    }
  }, [response]);

  const handleInputChange = (index, field, value) => {
    if (typeof field !== "string") {
      console.error("⚠️ Invalid field type:", typeof field);
      return;
    }

    const updatedEntries = [...entries];
    const previousValue = parseFloat(updatedEntries[index][field]) || 0;
    if (field === "entity") {
      fetchProjects(index, value);
    }
    if (field === "project") {
      fetchTech(index, value);
    }
    if (field === "duration") {
      let newValue = parseFloat(value) || 0;
      newValue = parseFloat(newValue.toFixed(1)); // Round to 1 decimal place

      const prevValue = parseFloat(previousValue.toFixed(1));
      const newTotal = parseFloat(
        (totalHours - prevValue + newValue).toFixed(1)
      );

      // ✅ Prevent total exceeding 24
      if (newTotal > 24) {
        showPopup("⚠️ Warning", "Total hours cannot exceed 24 per day!");
        return;
      }

      // ✅ Prevent negative values
      if (newValue < 0) {
        showPopup("⚠️ Warning", "Duration cannot be negative!");
        return;
      }

      // ✅ Update duration field
      updatedEntries[index][field] = newValue;
      setTotalHours(newTotal);
    } else {
      updatedEntries[index][field] = value;
    }

    setEntries(updatedEntries);
  };

  const handleAdd = () => {
    const lastEntry = entries[entries.length - 1];

    if (
      !lastEntry.entity ||
      !lastEntry.project ||
      !lastEntry.technology ||
      !lastEntry.details ||
      !lastEntry.duration
    ) {
      showPopup(
        "⚠️ Warning",
        "Please fill out all fields before adding a new row."
      );
      return;
    }

    if (totalHours >= 24) {
      showPopup("⚠️ Warning", "Maximum 24 hours reached!");
      return;
    }

    setEntries([
      ...entries,
      {
        entity: "",
        project: "",
        technology: "",
        details: "",
        duration: "",

        projects: [],
        technologies: [],
      },
    ]);
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDelete = (index) => {
    const deletedDuration = parseFloat(entries[index]?.duration) || 0;
    const newTotal = Math.max(totalHours - deletedDuration, 0);
    setTotalHours(newTotal);
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Modify the handleSubmit function to include both new entries and edited responses
  const handleSubmit = async () => {
    // Validate entries
    const hasValidEntries = entries.some(
      (entry) =>
        entry.entity &&
        entry.project &&
        entry.technology &&
        entry.details &&
        entry.duration
    );

    const hasEditedEntries = updatedResponse.some(
      (item) => item.statusName === "REJECT" && item.isEdited
    );

    if (!hasValidEntries && !hasEditedEntries) {
      showPopup(
        "⚠️ Error",
        "Please add at least one valid entry before submitting"
      );
      return;
    }

    // Prepare data for submission
    const editedRejects = updatedResponse
      .filter((item) => item.statusName === "REJECT" && item.isEdited)
      .map((item) => ({
        workId: item.workId,
        userId: userId,
        entityId: item.entityId,
        projectId: item.projectId,
        technologyId: item.technologyId,
        taskStatus: item.taskStatus,
        description: item.description,
        duration: item.duration,
        statusCode: "SM",
      }));
    console.log("Updated res ; ", editedRejects);
    console.log("Updated respo ; ", updatedResponse);
    const newEntries = entries
      .filter((entry) => entry.entity && entry.project) // Only include valid entries
      .map((entry) => ({
        userId: userId,
        entityId: entry.entity,
        projectId: entry.project,
        technologyId: entry.technology,
        taskStatus: entry.status || "1",
        description: entry.details,
        duration: entry.duration,
        statusCode: "SM",
      }));

    try {
      const result = await postResponse([...editedRejects, ...newEntries]);
      if (result.responseCode === "201") {
        showPopup("Success", "Timesheet submitted successfully!");
        // Reset form
        setEntries([
          {
            entity: "",
            project: "",
            technology: "",
            details: "",
            duration: "",
            projects: [],
            technologies: [],
          },
        ]);
        fetchTaskUpdates(userId); // Refresh data
      }
    } catch (error) {
      showPopup("Error", "Failed to submit timesheet");
    }
  };

  const today = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const showPopup = (headerTitle, message) => {
    setHeader(headerTitle); // Set the popup header dynamically
    setPopupMessage(message); // Set the popup message
    setOpenPopup(true); // Open the popup
  };
  useEffect(() => {
    let timer;

    if (openPopup) {
      timer = setTimeout(() => {
        setOpenPopup(false);
      }, 2000);
    }

    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key.length === 1) {
        setOpenPopup(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // ✅ Cleanup Timer and Listener on Unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPopup]);
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.slice(
      -2
    )}`; // Ensure 2-digit day/month & 2-digit year
  };

  return (
    <div className="containers">
      <Box sx={{ display: "flex", gap: "15px" }}>
        <Typography variant="h5" sx={{ mt: 0, mb: 0 }} gutterBottom>
          Timesheet Entry
        </Typography>
        <Box
          sx={{
            background: "linear-gradient(145deg, #6200ea, #842988)", // Gradient background
            borderRadius: "16px", // Rounded corners
            padding: "5px", // Inner padding
            // boxShadow: "0 8px 24px rgba(0,0,0,0.2)", // Soft shadow
            color: "#fff", // White text
            textAlign: "left", // Align text to the left
            width: "130px", // Box width
            // margin: "20px 0", // No auto-centering, top-bottom margin only
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "2px",
              textShadow: "2px 4px 6px rgba(0,0,0,0.2)", // Text shadow for pop effect
            }}
          >
            {today}
          </Typography>
        </Box>
      </Box>
      {/* ✅ Tabs for Switching Pages */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="transperent"
        sx={{
          borderRadius: "8px",
          backgroundColor: "#f4f5f7",
          padding: "4px",
          minHeight: "30px",
          mt: -2,
        }}
      >
        <Tab
          label="Today"
          sx={{
            backgroundColor: tabIndex === 0 ? "success.main" : "transparent",
            color: tabIndex === 0 ? "white" : "black",
            // borderRadius: "12px",
            padding: "5px 10px",
            fontWeight: "bold",
            boxShadow: tabIndex === 0 ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: tabIndex === 0 ? "success.dark" : "#e0e0e0",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            },
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />
        <Tab
          label="Monthly"
          sx={{
            backgroundColor: tabIndex === 1 ? "success.main" : "transparent",
            color: tabIndex === 1 ? "white" : "black",
            // borderRadius: "12px",
            padding: "5px 20px",
            fontWeight: "bold",
            boxShadow: tabIndex === 1 ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: tabIndex === 1 ? "success.dark" : "#e0e0e0",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            },
            "&.Mui-selected": {
              color: "white",
            },
          }}
        />
      </Tabs>

      {tabIndex === 0 && (
        <>
          <Paper
            sx={{
              marginTop: 1,
              padding: 0,
              borderRadius: "10px 10px 0 0",
              overflow: "hidden",
            }}
          >
            <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
                      S.No
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        height: "60px",
                        width: "10%",
                        fontSize: "14px", // Font size for text
                        fontWeight: "bold", // Bold text for headers
                        textAlign: "left", // Align text to the left
                        padding: "10px", // Consistent padding
                        whiteSpace: "nowrap", // Prevent text from wrapping
                        overflow: "hidden", // Hide overflow content
                        textOverflow: "ellipsis",
                      }}
                    >
                      Entity
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "5%" }}>
                      Project
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "5%" }}>
                      Technology
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "37%" }}>
                      Details
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "7%", textAlign: "center" }}>
                      Duration (hrs)
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "10%" }}>
                      Task Status
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "7%" }}>
                      Approval Status
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "20%" }}>
                      Reamarks
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
                      Action
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(response) &&
                    response.length > 0 &&
                    response.map((data, index) => {
                      // Check if this row is rejected and should be editable
                      const isRejected = data.statusName === "REJECT";

                      return isRejected ? (
                        <EditableTimesheetRow
                          key={`editable-${index}`}
                          data={data}
                          index={index}
                          entities={entities}
                          onSave={(updatedData) => {
                            setUpdatedResponse((prev) =>
                              prev.map((item) =>
                                item.workId === updatedData.workId
                                  ? {
                                      ...item,
                                      workId: updatedData.workId,
                                      entity: updatedData.entity,
                                      project: updatedData.project,
                                      technology: updatedData.technology,
                                      status: updatedData.status,
                                      details: updatedData.details,
                                      duration: updatedData.duration,
                                      isEdited: true,
                                      statusCode: "SM", // Assuming this is static for each
                                    }
                                  : item
                              )
                            );
                          }}
                        />
                      ) : (
                        <StyledTableRow
                          key={`readonly-${index}`}
                          sx={{ height: "40px" }}
                        >
                          {/* Row Number */}
                          <StyledTableCell
                            sx={{ width: "5%", textAlign: "center !important" }}
                          >
                            {index + 1}
                          </StyledTableCell>

                          {/* Entity Selection */}
                          <StyledTableCell
                            sx={{
                              width: "200px",
                              padding: "8px",
                              paddingLeft: "20px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                            }}
                          >
                            {data.entityName}
                          </StyledTableCell>

                          {/* Project Selection */}
                          <StyledTableCell
                            sx={{
                              width: "200px",
                              padding: "8px",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {data.projectName}
                          </StyledTableCell>

                          {/* Technology Selection */}
                          <StyledTableCell
                            sx={{
                              width: "200px",
                              padding: "8px",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {data.technologyName}
                          </StyledTableCell>

                          {/* Description Input */}
                          <StyledTableCell
                            sx={{
                              padding: "8px",
                              textAlign: "left",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {data.description}
                          </StyledTableCell>

                          {/* Duration Input */}
                          <StyledTableCell
                            sx={{ textAlign: "right !important" }}
                          >
                            {data.duration}
                          </StyledTableCell>

                          {/* Task Status */}
                          <StyledTableCell
                            sx={{ width: "200px", padding: "8px" }}
                          >
                            {data.taskStatusName}
                          </StyledTableCell>

                          {/* Approval Status */}
                          <StyledTableCell
                            sx={{ width: "200px", padding: "8px" }}
                          >
                            {data.statusName}
                          </StyledTableCell>

                          {/* Remarks */}
                          <StyledTableCell
                            sx={{ width: "200px", padding: "8px" }}
                          >
                            {data.remarks}
                          </StyledTableCell>

                          {/* Action Buttons */}
                          <StyledTableCell
                            sx={{
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px",
                            }}
                          >
                            {isRejected && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => {
                                  // Convert to editable mode by adding to entries
                                  const newEntry = {
                                    entity: data.entityId,
                                    project: data.projectId,
                                    technology: data.technologyId,
                                    details: data.description,
                                    duration: data.duration,
                                    status:
                                      data.taskStatus === "INPROGRESS"
                                        ? "1"
                                        : "2",
                                    projects: [],
                                    technologies: [],
                                  };
                                  setEntries([...entries, newEntry]);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}

                  {/* Form for new entries */}
                  <TimesheetForm
                    entries={entries}
                    entities={entities}
                    ind={ind}
                    handleInputChange={handleInputChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                  />

                  {/* Total hours row */}
                  <StyledTableRow
                    sx={{
                      position: "sticky",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      zIndex: 2,
                    }}
                  >
                    <StyledTableCell colSpan={4}></StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "end !important" }}>
                      <b>Total (hrs) : </b>
                    </StyledTableCell>
                    <StyledTableCell
                      colSpan={1}
                      sx={{ textAlign: "right !important" }}
                    >
                      <b>{isNaN(totalHours) ? 0 : totalHours}</b>
                    </StyledTableCell>
                    <StyledTableCell colSpan={3}></StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DoneIcon />}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
      {tabIndex === 1 && <MonthlyTimeSheet emp={employeeData.employeeId} />}
      {/* {tabIndex === 1 && <MonthlyTimeSheet emp={1} />} */}
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        BackdropProps={{
          style: {
            backdropFilter: "blur(8px)", // 8px blur effect
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Slightly dark background
          },
        }}
      >
        <Paper
          sx={{
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: header.includes("⚠️") ? "#d32f2f" : "#2e7d32",
            }}
          >
            {header}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "16px" }}>
            {popupMessage}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPopup(false)}
          >
            OK
          </Button>
        </Paper>
      </Dialog>
    </div>
  );
};

export default TimesheetSelection;

export const TimesheetForm = ({
  entries,
  entities,
  ind,
  handleInputChange,
  handleAdd,
  handleDelete,
}) => {
  // Track validation state for each row
  const [validationErrors, setValidationErrors] = React.useState({});

  const isEmpty = (value) => !value || value === "";

  const validateRow = (index) => {
    const entry = entries[index];
    const errors = {
      entity: isEmpty(entry.entity),
      project: isEmpty(entry.project),
      technology: isEmpty(entry.technology),
      details: isEmpty(entry.details),
      duration: isEmpty(entry.duration),
      status: isEmpty(entry.status),
    };

    setValidationErrors((prev) => ({
      ...prev,
      [index]: errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const handleAddWithValidation = () => {
    // Check all existing rows for validation
    let hasErrors = false;
    entries.forEach((_, index) => {
      if (validateRow(index)) {
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      handleAdd();
    }
  };

  return (
    <>
      {entries.map((entry, index) => {
        const rowErrors = validationErrors[index] || {};

        return (
          <StyledTableRow key={index}>
            <StyledTableCell
              sx={{ width: "5%", textAlign: "center !important" }}
            >
              {ind + index + 1}
            </StyledTableCell>

            {/* Entity Dropdown */}
            <StyledTableCell
              sx={{ width: "auto", padding: "8px", minWidth: "125px" }}
            >
              <Autocomplete
                size="small"
                fullWidth
                disableClearable
                options={entities || []}
                getOptionLabel={(option) => option.entityCode || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.entityId === value?.entityId
                }
                value={
                  entities.find((item) => item.entityId === entry.entity) || ""
                }
                onChange={(e, newValue) => {
                  handleInputChange(index, "entity", newValue?.entityId || "");
                  // Clear error when user makes a selection
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      entity: false,
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    error={rowErrors.entity}
                    helperText={rowErrors.entity ? "" : ""}
                  />
                )}
              />
            </StyledTableCell>

            {/* Project Dropdown */}
            <StyledTableCell
              sx={{ width: "auto", padding: "8px", minWidth: "150px" }}
            >
              <Autocomplete
                size="small"
                fullWidth
                disableClearable
                options={entry.projects || []}
                getOptionLabel={(option) => option.projectName || ""}
                isOptionEqualToValue={(option, value) =>
                  option.projectId === value.projectId
                }
                value={
                  entry.projects.find(
                    (item) => item.projectId === entry.project
                  ) || "JAVA"
                }
                onChange={(e, newValue) => {
                  handleInputChange(
                    index,
                    "project",
                    newValue?.projectId || ""
                  );
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      project: false,
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    error={rowErrors.project}
                    helperText={rowErrors.project ? "" : ""}
                  />
                )}
              />
            </StyledTableCell>

            {/* Technology Dropdown */}
            <StyledTableCell
              sx={{ width: "auto", padding: "8px", minWidth: "200px" }}
            >
              <Autocomplete
                size="small"
                fullWidth
                disableClearable
                options={entry.technologies || []}
                getOptionLabel={(option) => option.technologyName || ""}
                isOptionEqualToValue={(option, value) =>
                  option.technologyId === value.technologyId
                }
                value={
                  entry.technologies.find(
                    (item) => item.technologyId === entry.technology
                  ) || null
                }
                onChange={(e, newValue) => {
                  handleInputChange(
                    index,
                    "technology",
                    newValue?.technologyId || ""
                  );
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      technology: false,
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    error={rowErrors.technology}
                    helperText={rowErrors.technology ? "" : ""}
                  />
                )}
              />
            </StyledTableCell>

            {/* Details Textarea */}
            <StyledTableCell>
              <TextField
                multiline
                sx={{ padding: 0 }}
                rows={1}
                fullWidth
                variant="outlined"
                value={entry.details || ""}
                onChange={(e) => {
                  handleInputChange(index, "details", e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      details: false,
                    },
                  }));
                }}
                error={rowErrors.details}
                helperText={rowErrors.details ? "" : ""}
              />
            </StyledTableCell>

            {/* Duration Input */}
            <StyledTableCell>
              <TextField
                size="small"
                type="number"
                fullWidth
                value={entry.duration || ""}
                onChange={(e) => {
                  handleInputChange(index, "duration", e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      duration: false,
                    },
                  }));
                }}
                error={rowErrors.duration}
                helperText={rowErrors.duration ? "" : ""}
              />
            </StyledTableCell>

            {/* Status Dropdown */}
            <StyledTableCell sx={{ width: "200px", padding: "8px" }}>
              <TextField
                select
                size="small"
                fullWidth
                value={entry.status || "1"}
                onChange={(e) => {
                  handleInputChange(index, "status", e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      status: false,
                    },
                  }));
                }}
                variant="outlined"
                error={rowErrors.status}
                helperText={rowErrors.status ? "" : ""}
              >
                <MenuItem key="1" value="1">
                  INPROGRESS
                </MenuItem>
                <MenuItem key="2" value="2">
                  COMPLETED
                </MenuItem>
              </TextField>
            </StyledTableCell>

            <StyledTableCell colSpan={2}></StyledTableCell>
            {/* Action Buttons */}
            <StyledTableCell
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: "8px",
                paddingTop: "8px",
                margin: "10px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{
                  minWidth: "30px",
                  width: "30px",
                  height: "30px",
                  padding: "4px",
                }}
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  minWidth: "30px",
                  width: "30px",
                  height: "30px",
                  padding: "4px",
                }}
                onClick={handleAddWithValidation}
              >
                <AddIcon />
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        );
      })}
    </>
  );
};

const EditableTimesheetRow = ({ data, index, entities, onSave }) => {
  // Initialize state with all necessary data
  const [editableData, setEditableData] = useState({
    entity: data.entityId,
    project: data.projectId,
    technology: data.technologyId,
    details: data.description,
    duration: data.duration,
    status: !data.taskStatus || data.taskStatus === "INPROGRESS" ? "1" : "2",
    statusName: data.statusName,
    remarks: data.remarks,
    entityName: data.entityName,
    projectName: data.projectName,
    technologyName: data.technologyName,
  });

  const [projects, setProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!editableData.details || !editableData.duration) {
      return; // Don't save if required fields are empty
    }

    onSave({
      entity: data.entityId,
      project: data.projectId,
      technology: data.technologyId,
      details: editableData.details,
      duration: editableData.duration,
      status: editableData.status,
      workId: data.workId, // Include workId for updates
    });
  };

  if (isLoading) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>
          Loading...
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  return (
    <StyledTableRow sx={{ backgroundColor: "#fff8e1" }}>
      {/* Light yellow background for editable rows */}
      <StyledTableCell sx={{ width: "5%", textAlign: "center !important" }}>
        {index + 1}
      </StyledTableCell>
      {/* Entity Dropdown */}
      <StyledTableCell>{editableData.entityName}</StyledTableCell>
      {/* Project Dropdown */}
      <StyledTableCell>{editableData.projectName}</StyledTableCell>
      {/* Technology Dropdown */}
      {/* <StyledTableCell>{editableData.technologyName}</StyledTableCell>{" "} */}
      <StyledTableCell>
        <TextField
          value={editableData.technologyName}
          onChange={(e) => handleChange("details", e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          multiline
          rows={1}
          error={!editableData.technologyName}
          helperText={!editableData.technologyName ? "Required" : ""}
        />
      </StyledTableCell>
      {/* Details */}
      <StyledTableCell>
        <TextField
          value={editableData.details}
          onChange={(e) => handleChange("details", e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
          multiline
          rows={1}
          error={!editableData.details}
          helperText={!editableData.details ? "Required" : ""}
        />
      </StyledTableCell>
      {/* Duration */}
      <StyledTableCell>
        <TextField
          type="number"
          value={editableData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          size="small"
          variant="outlined"
          inputProps={{ min: 0, max: 24, step: 0.5 }}
          error={!editableData.duration || editableData.duration <= 0}
          helperText={
            !editableData.duration
              ? "Required"
              : editableData.duration <= 0
              ? "Must be positive"
              : ""
          }
        />
      </StyledTableCell>
      {/* Task Status */}
      <StyledTableCell sx={{ width: "200px", padding: "8px" }}>
        <TextField
          select
          fullWidth
          value={editableData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          size="small"
          variant="outlined"
        >
          <MenuItem value="1">INPROGRESS</MenuItem>
          <MenuItem value="2">COMPLETED</MenuItem>
        </TextField>
      </StyledTableCell>
      {/* Approval Status */}
      <StyledTableCell>{editableData.statusName}</StyledTableCell>
      {/* Remarks */}
      <StyledTableCell>{editableData.remarks}</StyledTableCell>
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={handleSave}
        sx={{
          minWidth: "30px",
          width: "30px",
          height: "30px",
          padding: "4px",
        }}
      >
        <DoneIcon />
      </Button>
      {/* Action Buttons */}
    </StyledTableRow>
  );
};
