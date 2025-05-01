import React, { useState, useMemo, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Typography,
  styled,
  Box,
  Button,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import {
  getTeamReport,
  updateWorkStatus,
  updateWorkReject,
  historyData,
} from "../../Pages/api.js";
import { EmployeesTimeSheet } from "./EmployeesTimeSheet.jsx";
import { MonthlyTimeSheet } from "./MonthlyTimeSheet.jsx";
import { HistoryTable } from "./HistoryTable.jsx";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  padding: "8px",
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#842988",
  color: theme.palette.common.white,
}));

export const TeamTimeSheet = ({ employeeData }) => {
  const userId = sessionStorage.getItem("employeeId");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [header, setHeader] = useState("Success!");

  const [tabIndex, setTabIndex] = useState(0);
  const [sampleData, setSampleData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [taskUpdates, setTaskUpdates] = useState([]);
  const [request, setRequest] = useState({
    workId: null,
    userId: null,
    statusCode: "RJ",
    remark: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

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
    fetchTeamTaskUpdates(userId);
  }, []);
  useEffect(() => {
    console.log("Reject request : ", request);
  }, [request]);

  useEffect(() => {
    if (!Array.isArray(sampleData)) return;
    const updatedTasks = sampleData.flatMap((entry) =>
      (entry.data || []).map((task) => ({
        ...task,
        status: "Submitted",
        remarks: "",
      }))
    );
    setTaskUpdates(updatedTasks);
  }, [sampleData]);
  useEffect(() => {
    const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    const entityId = employeeData?.entityId;
    const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | ${entityName} | Timesheet`;
  }, []);
  const fetchTeamTaskUpdates = async (userId) => {
    try {
      const data = await getTeamReport(userId);
      if (
        data?.responseCode === "200" &&
        Array.isArray(data.data.teamMemeber)
      ) {
        const flattened = data.data.teamMemeber.flat();
        setTeamData(flattened);
        console.log("Team Data : ", flattened);
      }
      if (data?.responseCode === "200" && Array.isArray(data.data.teamLead)) {
        const TData = data.data.teamLead.flat();
        setSampleData(TData);
        console.log("TeamData : ", TData);
      }
    } catch (error) {
      setSampleData([]);
    }
  };

  const updateTaskStatus = async (request) => {
    try {
      const data = await updateWorkStatus(request);
      if (data?.responseCode === "200") {
        console.log("Status updated successfully");

        setSelectedTasks([]);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      fetchTeamTaskUpdates(userId);
    }
  };
  const updateTaskReject = async (request) => {
    try {
      const data = await updateWorkReject(request); // assumes request contains workId, statusCode, userId, remark
      if (data?.responseCode === "200") {
        console.log("Status updated successfully");
        // fetchTeamTaskUpdates(userId);
      }

      fetchTeamTaskUpdates(userId);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // The function to handle checkbox change
  const handleCheckboxChange = (workId, userId) => {
    const remark = "Approved by manager";
    const statusCode = "AC";

    setSelectedTasks((prevSelected) => {
      const isSelected = prevSelected.some((task) => task.workId === workId);

      if (isSelected) {
        return prevSelected.filter((task) => task.workId !== workId);
      } else {
        return [
          ...prevSelected,
          { workId, userId, statusCode: statusCode, remark: remark },
        ];
      }
    });
  };
  const handleMultipleAccept = () => {
    updateTaskStatus(selectedTasks);

    showPopup("✅ Success", "Task accepted");
  };
  const handleStatusChange = (workId, status, remark = "", userId) => {
    const requestObj = {
      workId,
      statusCode: status,
      userId: userId,
      remark: status === "RJ" ? remark : "Approved by team lead",
    };

    setRequest(requestObj);
    updateTaskStatus(requestObj);

    setTaskUpdates((prevTasks) =>
      prevTasks.map((task) =>
        task.workId === workId || task.workId === workId
          ? { ...task, status, remarks: remark }
          : task
      )
    );

    if (status === "AC") {
      setSnackbar({
        open: true,
        message: "Work Accepted",
        severity: "success",
      });
    } else if (status === "RJ") {
      setSnackbar({
        open: true,
        message: "Work Rejected",
        severity: "error",
      });
    }
    fetchTeamTaskUpdates(userId);
  };
  useEffect(() => {
    console.log("Selected tasks : ", selectedTasks);
  }, [selectedTasks]);

  const handleOpenModal = (index, workId, userId) => {
    setSelectedTaskIndex(index);
    setRequest((prev) => ({ ...prev, workId, userId }));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setRequest((prev) => ({ ...prev, remark: "" }));
  };

  const handleSaveRemarks = () => {
    if (request && request.workId) {
      updateTaskReject(request);
    }
    setOpenModal(false);
    fetchTeamTaskUpdates(userId);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.slice(
      -2
    )}`;
  };

  let rowIndex = 0;
  const filteredData = useMemo(() => {
    if (!searchQuery) return sampleData;
    const searchTerms = searchQuery
      .split(",")
      .map((term) => term.trim().toLowerCase());

    return sampleData
      .map((entry) => {
        const employeeName = entry.employee?.toLowerCase() || "";
        const entryDate = entry.date?.toLowerCase() || "";
        const entryDuration = entry.duration?.toString() || "";
        const employeeMatch = searchTerms.some((term) =>
          employeeName.includes(term)
        );
        const dateMatch = searchTerms.some((term) => entryDate.includes(term));
        const durationMatch = searchTerms.some((term) =>
          entryDuration.includes(term)
        );

        const filteredTasks = Array.isArray(entry.data)
          ? entry.data.filter((task) =>
              searchTerms.some((term) =>
                [
                  task.projectName,
                  task.entityName,
                  task.technologyName,
                  task.description,
                  task.workId,
                  task.remarks,
                  task.statusName,
                  task.taskName,
                  task.employeeId,
                ].some((val) => val?.toLowerCase().includes(term))
              )
            )
          : [];

        if (
          employeeMatch ||
          durationMatch ||
          dateMatch ||
          filteredTasks.length > 0
        ) {
          return {
            ...entry,
            data: employeeMatch || dateMatch ? entry.data : filteredTasks,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [searchQuery, sampleData]);

  return (
    <>
      <Paper sx={{ marginTop: 5, padding: 2 }}>
        <Typography variant="h4" sx={{ mt: 0, mb: 4 }} gutterBottom>
          👥 Team TimeSheet
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="transperent"
          sx={{
            gap: "10px",
            borderRadius: "8px",
            backgroundColor: "#f4f5f7",
            padding: "4px",
            minHeight: "30px",
            mt: -3,
          }}
        >
          <Tab
            label="Team"
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
            label="Team Members"
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
          <Tab
            label="History"
            sx={{
              backgroundColor: tabIndex === 2 ? "success.main" : "transparent",
              color: tabIndex === 2 ? "white" : "black",
              // borderRadius: "12px",
              padding: "5px 20px",
              fontWeight: "bold",
              boxShadow: tabIndex === 2 ? "0 4px 15px rgba(0,0,0,0.2)" : "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: tabIndex === 2 ? "success.dark" : "#e0e0e0",
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
            <TableContainer
              sx={{ maxHeight: "65vh", overflowY: "auto", overflowX: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#7D287D" }}>
                    <StyledTableCell
                      colSpan={11}
                      sx={{ padding: "8px", backgroundColor: "transparent" }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="medium"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: "#7D287D" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          backgroundColor: "transparent",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { border: "none" },
                            backgroundColor: "transparent",
                          },
                          input: { color: "white" },
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "4px",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            minWidth: "30px",
                            width: "30px",
                            height: "30px",
                            padding: "4px",
                          }}
                          onClick={() => handleMultipleAccept()}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Button>
                      </Box>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow
                    sx={{ backgroundColor: "#7D287D", padding: "0px 10px" }}
                  >
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>Employee</StyledTableCell>
                    <StyledTableCell sx={{ width: "8%" }}>Date</StyledTableCell>
                    <StyledTableCell>Entity Name</StyledTableCell>
                    <StyledTableCell>Project Name</StyledTableCell>
                    <StyledTableCell>Client Name</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell sx={{ width: "1%" }}>
                      Duration (hrs)
                    </StyledTableCell>
                    <StyledTableCell>Task Status</StyledTableCell>
                    <StyledTableCell>Remarks</StyledTableCell>
                    <StyledTableCell>Review Status</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.map((entry, index) => (
                    <React.Fragment key={index}>
                      {(entry.data || []).map((item, subIndex) => {
                        const bgColor =
                          rowIndex % 2 === 0 ? "#f3e5f5" : "#ede7f6";
                        rowIndex++;

                        return (
                          <TableRow key={`${index}-${subIndex}`}>
                            {/* Debugging */}

                            {/* ✅ New Checkbox Cell */}
                            <TableCell padding="checkbox">
                              {item.statusName === "SUBMIT" && (
                                <Checkbox
                                  checked={selectedTasks.some(
                                    (task) => task.workId === item.work_Id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      item.work_Id,
                                      item.employeeId
                                    )
                                  }
                                />
                              )}
                            </TableCell>

                            {/* Existing Columns */}
                            {subIndex === 0 && (
                              <>
                                <TableCell rowSpan={entry.data.length}>
                                  {index + 1}
                                </TableCell>
                                <TableCell rowSpan={entry.data.length}>
                                  {entry.name}
                                </TableCell>
                                <TableCell rowSpan={entry.data.length}>
                                  {formatDate(entry.date)}
                                </TableCell>
                              </>
                            )}
                            <TableCell>{item.companyName}</TableCell>
                            <TableCell>{item.projectName}</TableCell>
                            <TableCell>{item.clientName || "-"}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell sx={{ textAlign: "end" }}>
                              {item.duration}
                            </TableCell>
                            <TableCell>{item.taskName}</TableCell>
                            <TableCell>{item.remarks}</TableCell>

                            {/* Conditional Rendering for Status */}
                            {item.statusName === "SUBMIT" && (
                              <TableCell sx={{ textAlign: "center" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "4px",
                                    justifyContent: "center",
                                  }}
                                >
                                  {/* <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() =>
                                  handleStatusChange(item.workId, "AC")
                                }
                              >
                                <CheckCircleIcon fontSize="small" />
                              </Button> */}
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
                                    onClick={() => {
                                      handleOpenModal(
                                        index,
                                        item.work_Id,
                                        item.employeeId
                                      ),
                                        console.log(item.work_Id);
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </Button>
                                </Box>
                              </TableCell>
                            )}
                            {item.statusName === "ACCEPT" && (
                              <TableCell>ACCEPTED</TableCell>
                            )}
                            {item.statusName === "REJECT" && (
                              <TableCell>REJECTED</TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{ backgroundColor: "#d1c4e9" }}
                        />
                        <TableCell
                          sx={{
                            backgroundColor: "#d1c4e9",
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          Total Duration:
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#d1c4e9",
                            fontWeight: "bold",
                            textAlign: "end",
                          }}
                        >
                          {entry.duration}
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          sx={{ backgroundColor: "#d1c4e9" }}
                        />
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sampleData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        {tabIndex === 1 && <EmployeesTimeSheet teamData={teamData} />}
        {tabIndex === 2 && <HistoryTable />}

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Remarks</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter remarks..."
              value={request.remark}
              onChange={(e) =>
                setRequest((prev) => ({ ...prev, remark: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveRemarks}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
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
    </>
  );
};
