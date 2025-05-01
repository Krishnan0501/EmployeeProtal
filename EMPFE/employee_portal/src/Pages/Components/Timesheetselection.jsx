import React, { useState, useEffect, useCallback } from "react";
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
  Autocomplete, Tooltip, CircularProgress
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
  deleteRow,
} from "../../Pages/api.js";
import { MonthlyTimeSheet } from "./MonthlyTimeSheet.jsx";

const StyledNumberInput = styled(TextField)(({ theme }) => ({
  "& input[type=number]": {
    MozAppearance: "textfield",
    appearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#f9f9f9", // Light gray bg
    borderRadius: "6px",
    paddingRight: "4px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: "2px",
  },
  "& input": {
    textAlign: "center",
    fontWeight: "500",
    fontSize: "1rem",
  },
}));

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
  const Id = sessionStorage.getItem("employeeId");
  const userId = parseInt(Id)
  const [entities, setEntities] = useState([]);
  const [response, setResponse] = useState([]);
  const [add, setAdd] = useState(false);
  const [deleteData, setDeleteData] = useState({
    userId: userId,
    workId: "",
  });
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
  // const [loadingEntities, setLoadingEntities] = useState(false); // For entity fetch
  const [loadingTasks, setLoadingTasks] = useState(false);      // For task data fetch
  const [submitting, setSubmitting] = useState(false);          // For form submission
  const [deleting, setDeleting] = useState(false);              // For row deletion
  useEffect(() => {
    const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    const entityId = employeeData?.entityId;
    const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | ${entityName} | Timesheet`;
  }, []);
  const [entries, setEntries] = useState([
    {
      entity: "",
      project: "",
      status: "1",
      details: "",
      duration: "",
      projects: [],
      technologies: [],
      statusCode: "SM",
      clientName: "",
    },
  ]);

  const fetchTaskUpdates = async (Id) => {
    setLoadingTasks(true);
    try {
      const data = await getTaskupdates(userId);

      if (data?.responseCode === "200" && Array.isArray(data.data)) {
        setResponse(data.data);
        console.log("Data : ", data.data);
      } else {
        console.warn("⚠️ No timesheet records found for today.");
        setResponse([]); // Set empty array instead of null
      }
    } catch (error) {
      console.error("❌ Failed to fetch task updates:", error.message);
      setResponse([]); // Ensure response is never null
    }
    setLoadingTasks(false);
  };


  const fetchEntity = async () => {
    try {
      const data = await getEntities();
      setEntities(data.data);
      console.log("Entities : ", data.data);
    } catch (error) {
      // showPopup("Unable to fetch entities");
      console.error("Error fetching entities:", error);
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
        console.log("projects :", updatedEntries);
      }
    } catch (error) {
      // showPopup("Unable to fetch projects");
      console.error("Error fetching projects:", error);
    }
  };

  const deleteRowData = async (request) => {
    setDeleting(true)
    try {
      const data = await deleteRow(request);

      console.log("🧾 Delete API Response:", data);

      // You can tweak this based on your API response structure
      if (
        data?.responseCode === "200" ||
        data?.responseCode === "204" ||
        data?.responseCode === "201"
      ) {
        showPopup("✅ Success", "Row deleted successfully");
      } else {
        showPopup("⚠️ Deletion unsuccessful or unexpected response");
      }


      fetchTaskUpdates(userId);

    } catch (error) {
      console.error("❌ Error Deleting row:", error);
      showPopup("❌ Error", "Unable to delete row. Please try again.");
    }
    setDeleting(false)
  };

  useEffect(() => {
    fetchEntity();
    fetchTaskUpdates(userId);
  }, []);


  const transformEntriesToResponse = async (entries) => {
    const formattedResponse = entries.map((entry) => ({
      userId: userId,
      entityId: entry.entity,
      projectId: entry.project,
      clientName: entry.clientName,
      taskStatus: entry.status || "1", // Default to "Inprogress" if not set
      description: entry.details,
      duration: entry.duration,
      statusCode: "SM",
    }));
    setResponse("Formated req :", formattedResponse);

    await postResponse(formattedResponse);
    // console.log(typeof response);
  };
  useEffect(() => {
    if (Array.isArray(response) && response.length > 0) {
      const total = response.reduce(
        (sum, data) => sum + (parseFloat(data.duration) || 0),
        0
      );

      setTotalHours(parseFloat(total.toFixed(1))); // ✅ Round to 1 decimal place
      // console.log("✅ Total Hours (API):", total.toFixed(1));
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
      console.log("Entity", value);
      fetchProjects(index, value);
    }

    if (field === "project") {
      // fetchTech(index, value);

      const selectedProject = updatedEntries[index].projects.find(
        (proj) => proj.projectId === value
      );

      updatedEntries[index].project = value;
      updatedEntries[index].clientName = selectedProject?.clientName || "";
    }

    if (field === "duration") {
      let newValue = parseFloat(value) || 0;

      const hours = Math.floor(newValue);
      const decimal = newValue - hours;
      const minutes = Math.round(decimal * 100);

      let correctedValue = newValue;
      if (minutes >= 60) {
        correctedValue = hours + 1;
      } else {
        correctedValue = hours + minutes / 100;
      }

      correctedValue = parseFloat(correctedValue.toFixed(2));
      const prevValue = parseFloat(previousValue.toFixed(2));
      const newTotal = parseFloat(
        (totalHours - prevValue + correctedValue).toFixed(2)
      );

      if (newTotal > 24) {
        showPopup("⚠️ Warning", "Total hours cannot exceed 24 per day!");
        return;
      }

      if (correctedValue < 0) {
        showPopup("⚠️ Warning", "Duration cannot be negative!");
        return;
      }

      updatedEntries[index][field] = correctedValue;
      setTotalHours(newTotal);
    } else {
      updatedEntries[index][field] = value;
    }

    setEntries(updatedEntries);
  };

  const handleAdd = () => {
    const lastEntry = entries[entries.length - 1];

    if (totalHours >= 24) {
      showPopup("⚠️ Warning", "Maximum 24 hours reached!");
      return;
    }

    const newEntry = {
      entity: "",
      project: "",
      status: "1",
      details: "",
      duration: "",
      clientName: "",
      projects: [],
      statusCode: "SM",
    };

    setEntries([...entries, newEntry]);
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
  const handleDeleteOld = (id) => {
    console.log("Delete id : ", id);
    setDeleteData({
      userId: userId,
      workId: id,
    });
  };
  useEffect(() => {
    if (deleteData.workId) {
      console.log("Updated Delete Data:", deleteData);
      deleteRowData(deleteData); // or trigger delete logic here
    }
  }, [deleteData]);

  const handleSubmit = async () => {
    // Validate entries
    const hasValidEntries = entries.some(
      (entry) =>
        entry.entity &&
        entry.project &&
        // entry.technology &&
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
        clientName: entry.clientName,
        taskStatus: entry.status || "1",
        description: entry.details,
        duration: entry.duration,
        statusCode: "SM",
      }));

    try {
      setSubmitting(true)
      const result = await postResponse([...editedRejects, ...newEntries]);
      if (result.responseCode === "201") {
        showPopup("Success", "Timesheet submitted successfully!");
        // Reset form
        setEntries([
          {
            entity: "",
            project: "",
            clientName: "",
            details: "",
            duration: "",
            projects: [],
            technologies: [],
          },
        ]);
        fetchTaskUpdates(userId); // Refresh data
      }
      setSubmitting(false)
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
  useEffect(() => {
    if (entries.length === 0) {
      setAdd(false);
      const newEntry = {
        entity: "",
        project: "",
        status: "1",
        details: "",
        duration: "",
        clientName: "",
        projects: [],
        statusCode: "SM",
      };
      setEntries((prev) => [...prev, newEntry]);
    }
  }, [entries]);

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
            borderRadius: "16px",
            padding: "5px",
            color: "#fff",
            textAlign: "left",
            width: "130px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "2px",
              textShadow: "2px 4px 6px rgba(0,0,0,0.2)",
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
            <TableContainer sx={{ maxHeight: "70vh", overflowY: "auto" }}>
              {loadingTasks ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading data...</Typography>
                </Box>
              ) : (
                <Table stickyHeader>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
                        S.No
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          height: "60px",
                          width: "8%",
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
                      <StyledTableCell sx={{ width: "10%" }}>
                        Project
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "10%" }}>
                        Client Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "37%" }}>
                        Details
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "7%", textAlign: "center" }}>
                        Duration (hrs)
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "5%", minWidth: "5%" }}>
                        Task Status
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: "7%" }}>
                        Approval Status
                      </StyledTableCell>
                      {/* <StyledTableCell sx={{ width: "20%" }}>
                      Reamarks
                    </StyledTableCell> */}
                      <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
                        Action
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(response) &&
                      response.length > 0 &&
                      response.map((data, index) => {
                        const isRejected = data.statusName === "REJECT";

                        return isRejected ? (
                          <EditableTimesheetRow
                            key={`editable-${index}`}
                            data={data}
                            index={index}
                            entities={entities}

                            // fetchTaskUpdates={fetchTaskUpdates()}
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
                                      statusCode: "SM",
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
                              {data.clientName}
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
                              {data.statusName != "ACCEPT" && (
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
                                  onClick={() => handleDeleteOld(data.id)}
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                              {index === response.length - 1 && !add && (
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
                                  onClick={() => setAdd(true)}
                                >
                                  <AddIcon />
                                </Button>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}

                    {/* Form for new entries */}
                    {(response.length === 0 || add) && (
                      <TimesheetForm
                        entries={entries}
                        entities={entities}
                        ind={ind}
                        handleInputChange={handleInputChange}
                        handleAdd={handleAdd}
                        handleDelete={handleDelete}
                      />
                    )}

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
                      <StyledTableCell colSpan={2}></StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<DoneIcon />}
                          onClick={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? "Submitting..." : "Submit"}
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>)}
            </TableContainer>
          </Paper>
        </>
      )}
      {tabIndex === 1 && <MonthlyTimeSheet />}
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
      // technology: isEmpty(entry.technology),
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
        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror");
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
                  entities.find((item) => item.entityId === entry.entity) ||
                  "Loki"
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
              sx={{ width: "auto", padding: "8px", minWidth: "100px" }}
            >
              <Autocomplete
                size="small"
                fullWidth
                disableClearable
                options={entry.projects || []}
                getOptionLabel={(option) => option.projectCode || ""}
                isOptionEqualToValue={(option, value) =>
                  option.projectId === value.projectId
                }
                value={
                  entry.projects.find(
                    (item) => item.projectId === entry.project
                  ) || ""
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

            {/* client name */}
            <StyledTableCell
              sx={{ width: "auto", padding: "8px", minWidth: "150px" }}
            >
              {entry.clientName && (
                <p className="client-name">{entry.clientName}</p>
              )}

              {/* {entries.projects.clientName} */}
              {/* <Autocomplete
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
              /> */}
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
              <StyledNumberInput
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
                  IP
                </MenuItem>
                <MenuItem key="2" value="2">
                  COM
                </MenuItem>
              </TextField>
            </StyledTableCell>

            <StyledTableCell colSpan={1}></StyledTableCell>
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
              {entry === entries[entries.length - 1] && (

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
              )}
            </StyledTableCell>
          </StyledTableRow>
        );
      })}
    </>
  );
};

export const EditableTimesheetRow = ({ data, index, entities = [], onSave }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state with proper null checks
  // console.log("Data :::::::::::: ", data)
  const [editableData, setEditableData] = useState(() => ({
    employeeId: data?.employeeId || '',
    entity: data?.entityId || null,
    project: data?.projectId || null,
    workId: data?.id || '',
    clientName: data?.clientName || '',
    details: data?.description || '',
    duration: data?.duration || 0,
    status: !data?.taskStatusName || data.taskStatusName === "INPROGRESS" ? "1" : "2",
    statusName: data?.statusName || '',
    remarks: data?.remarks || '',
    entityName: data?.entityName || '',
    projectName: data?.projectName || '',
  }));

  const handleChange = useCallback((field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!editableData.details || !editableData.duration) {
      return;
    }

    const payload =
      [
        {

          userId: editableData.employeeId,
          entityId: editableData.entity,
          projectId: editableData.project,
          clientName: editableData.clientName,
          description: editableData.details,
          duration: editableData.duration,
          taskStatus: editableData.status,
          statusCode: "SM",
          workId: editableData.workId,
        }]

    setIsLoading(true);
    try {
      const response = await postResponse(payload);

      console.log("Api hit ayindhi ra loki : ", response)

      fetchTaskUpdates();
      // onSave?.(response);
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [editableData, onSave]);

  const fetchProjects = useCallback(async (entityId) => {
    if (!entityId) {
      setProjects([]);
      return;
    }

    try {
      const response = await getProjects(entityId);
      if (response?.data?.length) {
        // Ensure projects have unique IDs
        const uniqueProjects = response.data.reduce((acc, project) => {
          if (!acc.some(p => p.projectId === project.projectId)) {
            acc.push(project);
          }
          return acc;
        }, []);
        console.log("project data : ", response.data);
        setProjects(uniqueProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  }, []);

  // Initialize projects if entity is set
  useEffect(() => {
    if (editableData.entity) {
      fetchProjects(editableData.entity);
    }
  }, [editableData.entity, fetchProjects]);

  // Initialize entity if it comes from props
  useEffect(() => {
    if (data?.entityId && !editableData.entity) {
      setEditableData(prev => ({ ...prev, entity: data.entityId }));
    }
  }, [data?.entityId]);

  // Data validation
  useEffect(() => {
    if (entities) {
      const entityIds = entities.map(e => e.entityId);
      const uniqueEntityIds = [...new Set(entityIds)];
      if (entityIds.length !== uniqueEntityIds.size) {
        console.warn("Duplicate entity IDs detected in entities prop");
      }
    }
  }, [entities]);

  if (isLoading) {
    return (
      <StyledTableRow key={`loading-${data.id || index}`}>
        <StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>
          Loading...
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  // Generate unique keys for options
  const getEntityKey = (option) =>
    option?.entityId || `entity-${Math.random().toString(36).substr(2, 5)}`;

  const getProjectKey = (option) =>
    option?.projectId || `project-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <StyledTableRow
      key={`row-${data.id || index}`}
      sx={{ backgroundColor: "#fff8e1" }}
    >
      <StyledTableCell sx={{ width: "5%", textAlign: "center !important" }}>
        {index + 1}
      </StyledTableCell>

      {/* Entity Dropdown */}
      <StyledTableCell>
        {data.entityName}
      </StyledTableCell>

      {/* Project Dropdown */}
      <StyledTableCell>
        <Autocomplete
          key={`project-autocomplete-${editableData.entity || 'none'}-${index}`}
          size="small"
          fullWidth
          disableClearable
          options={projects}
          getOptionLabel={(option) => option.projectCode || "No code"}
          getOptionKey={getProjectKey}
          isOptionEqualToValue={(option, value) =>
            getProjectKey(option) === getProjectKey(value)
          }
          value={
            projects.find(
              (item) => item.projectId === editableData.project
            ) || null
          }
          onChange={(e, newValue) => {
            handleChange("project", newValue?.projectId || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label=""
            />
          )}
        />
      </StyledTableCell>

      {/* Client Name */}
      <StyledTableCell>{editableData.clientName}</StyledTableCell>

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
      <StyledTableCell>
        <Tooltip title={editableData.remarks || ""} arrow placement="top">
          <span>{editableData.statusName}</span>
        </Tooltip>
      </StyledTableCell>

      {/* Save Button */}
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
        {index === data.length - 1 && !add && (
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
            onClick={() => setAdd(true)}
          >
            <AddIcon />
          </Button>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

// export default EditableTimesheetRow;
// const EditableTimesheetRow = ({ data, index, entities, onSave }) => {
//   // Use the entity prop directly instead of fetching
//   const [projects, setProjects] = useState([]);
//   console.log("The Data OFFFFFFFFF : ", data)
//   console.log("The Entities OFFFFFFFFF : ", entities)
//   const [editableData, setEditableData] = useState({
//     employeeId: data.employeeId,
//     entity: null,
//     project: null,
//     workId: data.id,
//     clientName: data.clientName,
//     details: data.description,
//     duration: data.duration,
//     status: !data.taskStatus || data.taskStatus === "INPROGRESS" ? "1" : "2",
//     statusName: data.statusName,
//     remarks: data.remarks,
//     entityName: data.entityName,
//     projectName: data.projectName,
//   });

//   const handleChange = (field, value) => {
//     setEditableData((prev) => ({ ...prev, [field]: value }));
//   };

//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async () => {
//     if (!editableData.details || !editableData.duration) {
//       return; // Don't save if required fields are empty
//     }

//     const payload = {
//       entity: editableData.entity,
//       project: editableData.project,
//       clientName: editableData.clientName,
//       details: editableData.details,
//       duration: editableData.duration,
//       status: editableData.status,
//       workId: editableData.workId,
//     };

//     console.log("🚀 Submitting Data:", payload);

//     try {
//       const response = await postResponse(payload);
//     } catch (e) {
//       console.log("Error ", e);
//     }
//   };

//   if (isLoading) {
//     return (
//       <StyledTableRow>
//         <StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>
//           Loading...
//         </StyledTableCell>
//       </StyledTableRow>
//     );
//   }

//   const fetchProjects = async (entityId) => {
//     if (!entityId) return;
//     try {
//       const data = await getProjects(entityId);
//       if (data?.data?.length) {
//         setProjects(data.data);
//         console.log("projects :", data.data);
//       }
//     } catch (error) {
//       // showPopup("Unable to fetch projects");
//       console.error("Error fetching projects:", error);
//     }
//   };

//   useEffect(() => {
//     if (editableData.entity) {
//       fetchProjects(editableData.entity);
//     }
//   }, [editableData.entity]);

//   return (
//     <StyledTableRow sx={{ backgroundColor: "#fff8e1" }}>
//       {/* Light yellow background for editable rows */}
//       <StyledTableCell sx={{ width: "5%", textAlign: "center !important" }}>
//         {index + 1}
//       </StyledTableCell>

//       {/* Entity Dropdown */}
//       <StyledTableCell>
//         <Autocomplete
//           size="small"
//           fullWidth
//           disableClearable
//           options={entities || []}
//           getOptionLabel={(option) => option.entityName || ""}
//           isOptionEqualToValue={(option, value) =>
//             option.entityId === value.entityId
//           }
//           value={
//             entities.find(
//               (item) => item.entityId === editableData.entity
//             ) || null
//           }
//           onChange={(e, newValue) => {
//             handleChange("entity", newValue?.entityId || "");
//             setEditableData((prev) => ({
//               ...prev,
//               project: "", // clear project if entity changes
//             }));
//             fetchProjects(newValue?.entityId);
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//             />
//           )}
//           key={editableData.entity} // Ensure that key is unique
//         />

//       </StyledTableCell>

//       {/* Project Dropdown */}
//       <StyledTableCell>
//         <Autocomplete
//           size="small"
//           fullWidth
//           disableClearable
//           options={projects || []}
//           getOptionLabel={(option) => option.projectCode || ""}
//           isOptionEqualToValue={(option, value) =>
//             option.projectId === value.projectId
//           }
//           value={
//             projects.find(
//               (item) => item.projectId === editableData.project
//             ) || null
//           }
//           onChange={(e, newValue) => {
//             handleChange("project", newValue?.projectId || "");
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//             />
//           )}
//         />
//       </StyledTableCell>

//       {/* Client Name */}
//       <StyledTableCell>{editableData.clientName}</StyledTableCell>

//       {/* Details */}
//       <StyledTableCell>
//         <TextField
//           value={editableData.details}
//           onChange={(e) => handleChange("details", e.target.value)}
//           fullWidth
//           size="small"
//           variant="outlined"
//           multiline
//           rows={1}
//           error={!editableData.details}
//           helperText={!editableData.details ? "Required" : ""}
//         />
//       </StyledTableCell>

//       {/* Duration */}
//       <StyledTableCell>
//         <TextField
//           type="number"
//           value={editableData.duration}
//           onChange={(e) => handleChange("duration", e.target.value)}
//           size="small"
//           variant="outlined"
//           inputProps={{ min: 0, max: 24, step: 0.5 }}
//           error={!editableData.duration || editableData.duration <= 0}
//           helperText={
//             !editableData.duration
//               ? "Required"
//               : editableData.duration <= 0
//                 ? "Must be positive"
//                 : ""
//           }
//         />
//       </StyledTableCell>

//       {/* Task Status */}
//       <StyledTableCell sx={{ width: "200px", padding: "8px" }}>
//         <TextField
//           select
//           fullWidth
//           value={editableData.status}
//           onChange={(e) => handleChange("status", e.target.value)}
//           size="small"
//           variant="outlined"
//         >
//           <MenuItem value="1">INPROGRESS</MenuItem>
//           <MenuItem value="2">COMPLETED</MenuItem>
//         </TextField>
//       </StyledTableCell>

//       {/* Approval Status */}
//       <StyledTableCell>
//         <Tooltip title={editableData.remarks || ""} arrow placement="top">
//           <StyledTableCell>{editableData.statusName}</StyledTableCell>
//         </Tooltip>
//       </StyledTableCell>

//       {/* Remarks */}
//       <StyledTableCell
//         sx={{
//           display: "flex",
//           justifyContent: "end",
//           gap: "8px",
//           paddingTop: "8px",
//           margin: "10px",
//         }}
//       >
//         <Button
//           variant="contained"
//           color="success"
//           size="small"
//           onClick={handleSave}
//           sx={{
//             minWidth: "30px",
//             width: "30px",
//             height: "30px",
//             padding: "4px",
//           }}
//         >
//           <DoneIcon />
//         </Button>
//       </StyledTableCell>
//     </StyledTableRow>
//   );
// };

// const EditableTimesheetRow = ({ data, index, entities, onSave }) => {
//   // Initialize state with all necessary data

//   const [entity, setEntity] = useState([]);
//   const [projects, setProjects] = useState([]);

//   console.log("Data for the edit table : ", data)
//   const [editableData, setEditableData] = useState({
//     employeeId: data.employeeId,
//     entity: data.entityId,
//     project: data.projectId,
//     clientName: data.clientName,
//     details: data.description,
//     duration: data.duration,
//     status: !data.taskStatus || data.taskStatus === "INPROGRESS" ? "1" : "2",
//     statusName: data.statusName,
//     remarks: data.remarks,
//     entityName: data.entityName,
//     projectName: data.projectName,
//     technologyName: data.technologyName,
//   });
//   const handleChange = (field, value) => {
//     setEditableData((prev) => ({ ...prev, [field]: value }));
//   };
//   const [technologies, setTechnologies] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async () => {
//     if (!editableData.details || !editableData.duration) {
//       return; // Don't save if required fields are empty
//     }

//     const payload = {
//       entity: editableData.entity,
//       project: editableData.project,
//       clientName: editableData.clientName,
//       details: editableData.details,
//       duration: editableData.duration,
//       status: editableData.status,
//       workId: data.workId,
//     };

//     console.log("🚀 Submitting Data:", payload);


//     try {
//       const response = await postResponse(payload)
//     } catch (e) {
//       console.log("Error ", e)
//     }
//   };

//   if (isLoading) {
//     return (
//       <StyledTableRow>
//         <StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>
//           Loading...
//         </StyledTableCell>
//       </StyledTableRow>
//     );
//   }

//   const fetchEntity = async () => {
//     try {
//       const data = await getEntities();
//       setEntity(data.data);

//       console.log("Entities : ", data.data);
//     } catch (error) {
//       // showPopup("Unable to fetch entities");
//       console.error("Error fetching entities:", error);
//     }
//   };
//   const fetchProjects = async (index, entityId) => {
//     if (!entityId) return;
//     try {
//       const data = await getProjects(entityId);
//       if (data?.data?.length) {
//         setProjects(data.data);
//         console.log("projects :", data.data);
//       }
//     } catch (error) {
//       // showPopup("Unable to fetch projects");
//       console.error("Error fetching projects:", error);
//     }
//   };
//   useEffect(() => {
//     fetchEntity()
//   }, [])
//   useEffect(() => {
//     console.log('The Edit entity : ', entity)
//   }, [entity])

//   return (
//     <StyledTableRow sx={{ backgroundColor: "#fff8e1" }}>
//       {/* Light yellow background for editable rows */}
//       <StyledTableCell sx={{ width: "5%", textAlign: "center !important" }}>
//         {index + 1}
//       </StyledTableCell>
//       {/* Entity Dropdown */}
//       <StyledTableCell> <Autocomplete
//         size="small"
//         fullWidth
//         disableClearable
//         options={entry.projects || []}
//         getOptionLabel={(option) => option.projectCode || ""}
//         isOptionEqualToValue={(option, value) =>
//           option.projectId === value.projectId
//         }
//         value={
//           entry.projects.find(
//             (item) => item.projectId === entry.project
//           ) || ""
//         }
//         onChange={(e, newValue) => {
//           handleInputChange(
//             index,
//             "project",
//             newValue?.projectId || ""
//           );
//           setValidationErrors((prev) => ({
//             ...prev,
//             [index]: {
//               ...prev[index],
//               project: false,
//             },
//           }));
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             error={rowErrors.project}
//             helperText={rowErrors.project ? "" : ""}
//           />
//         )}
//       />
//       </StyledTableCell>
//       {/* Project Dropdown */}
//       <StyledTableCell>{editableData.projectName}</StyledTableCell>
//       {/* Technology Dropdown */}
//       {/* <StyledTableCell>{editableData.technologyName}</StyledTableCell>{" "} */}
//       <StyledTableCell>
//         {editableData.clientName}
//       </StyledTableCell>
//       {/* Details */}
//       <StyledTableCell>
//         <TextField
//           value={editableData.details}
//           onChange={(e) => handleChange("details", e.target.value)}
//           fullWidth
//           size="small"
//           variant="outlined"
//           multiline
//           rows={1}
//           error={!editableData.details}
//           helperText={!editableData.details ? "Required" : ""}
//         />
//       </StyledTableCell>
//       {/* Duration */}
//       <StyledTableCell>
//         <TextField
//           type="number"
//           value={editableData.duration}
//           onChange={(e) => handleChange("duration", e.target.value)}
//           size="small"
//           variant="outlined"
//           inputProps={{ min: 0, max: 24, step: 0.5 }}
//           error={!editableData.duration || editableData.duration <= 0}
//           helperText={
//             !editableData.duration
//               ? "Required"
//               : editableData.duration <= 0
//                 ? "Must be positive"
//                 : ""
//           }
//         />
//       </StyledTableCell>
//       {/* Task Status */}
//       <StyledTableCell sx={{ width: "200px", padding: "8px" }}>
//         <TextField
//           select
//           fullWidth
//           value={editableData.status}
//           onChange={(e) => handleChange("status", e.target.value)}
//           size="small"
//           variant="outlined"
//         >
//           <MenuItem value="1">INPROGRESS</MenuItem>
//           <MenuItem value="2">COMPLETED</MenuItem>
//         </TextField>
//       </StyledTableCell>
//       {/* Approval Status */}
//       <StyledTableCell><Tooltip title={editableData.remarks || ""} arrow placement="top">
//         <StyledTableCell>{editableData.statusName}</StyledTableCell>
//       </Tooltip></StyledTableCell>
//       {/* Remarks */}
//       <StyledTableCell sx={{
//         display: "flex",
//         justifyContent: "end",
//         gap: "8px",
//         paddingTop: "8px",
//         margin: "10px",
//       }}><Button
//         variant="contained"
//         color="success"
//         size="small"
//         onClick={handleSave}
//         sx={{
//           minWidth: "30px",
//           width: "30px",
//           height: "30px",
//           padding: "4px",
//         }}
//       >
//           <DoneIcon />
//         </Button></StyledTableCell>

//       {/* Action Buttons */}
//     </StyledTableRow>
//   );
// };
