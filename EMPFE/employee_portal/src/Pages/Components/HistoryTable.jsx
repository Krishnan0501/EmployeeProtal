import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  Button,
  TableRow,
  styled,
  TextField,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

import { postDownload, historyData } from "../../Pages/api.js";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 16px",
  fontSize: 12,
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#842988",
  color: theme.palette.common.white,
}));

export const HistoryTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [response, setResponse] = useState([]);
  const [request, setRequest] = useState({
    userId: parseInt(sessionStorage.getItem("employeeId")),
    date: dayjs().date(), // Day of month (1-31)
    month: dayjs().month() + 1, // Month (0-indexed → add 1)
    year: dayjs().year(), // Full year (e.g., 2025)
  });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [open, setOpen] = useState(false);

  const fetchTaskUpdates = async (req) => {
    setLoadingTasks(true);
    try {
      const data = await historyData(req);
      if (data?.responseCode === "200" && Array.isArray(data.data)) {
        setResponse(data.data);
      } else {
        console.warn("⚠️ No records found.");
        setResponse([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch task updates:", error.message);
      setResponse([]);
    }
    setLoadingTasks(false);
  };

  useEffect(() => {
    console.log("Initial request:", request);
    fetchTaskUpdates(request);
  }, []);

  useEffect(() => {
    console.log("Selected date:", selectedDate);
    setRequest({
      userId: parseInt(sessionStorage.getItem("employeeId")),
      date: parseInt(dayjs(selectedDate).format("DD")),
      month: parseInt(dayjs(selectedDate).format("MM")),
      year: parseInt(dayjs(selectedDate).format("YYYY")),
    });
  }, [selectedDate]);

  useEffect(() => {
    console.log("Request:", request);

    fetchTaskUpdates(request);
    setOpen(false);
  }, [request]);
  const filteredData = useMemo(() => {
    if (!searchQuery) return response;

    const searchTerms = searchQuery.toLowerCase().trim();
    return response.filter((item) => {
      return (
        (item.entityName &&
          item.entityName.toLowerCase().includes(searchTerms)) ||
        (item.projectName &&
          item.projectName.toLowerCase().includes(searchTerms)) ||
        (item.clientName &&
          item.clientName.toLowerCase().includes(searchTerms)) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerms)) ||
        (item.statusName &&
          item.statusName.toLowerCase().includes(searchTerms)) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchTerms))
      );
    });
  }, [response, searchQuery]);

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRepost = async () => {
    try {
      const blob = await postDownload({
        employeeId: [parseInt(sessionStorage.getItem("employeeId"))],
      });

      if (!blob) {
        console.error("❌ Download failed. No data received.");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Employee_History_Report.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("❌ Error in downloading:", error);
    }
  };

  return (
    <Paper sx={{ marginTop: 0, padding: 2 }}>
      <Box display="flex" gap={2} alignItems="center" px={2} py={1}>
        <Typography variant="h6">📅 Employee History</Typography>

        {/* <Button variant="outlined" onClick={() => setOpen(true)}>
              {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "Select Date"}
            </Button> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => setOpen(true)}
          >
            <DatePicker
              views={["year", "month", "day"]}
              open={open}
              onClose={() => setOpen(false)}
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(dayjs(newValue));
              }}
              renderInput={() => null} // hides native input
            />
          </Box>
        </LocalizationProvider>

        {/* {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "Select Date"} */}

        {/* <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={getRepost}
          sx={{ marginLeft: "auto" }}
        >
          <DownloadIcon />
        </Button> */}
      </Box>

      <TableContainer sx={{ maxHeight: "50vh" }}>
        {loadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading data...</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={10}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
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
              </TableRow>
              <TableRow>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell>Employee Name</StyledTableCell>
                <StyledTableCell>Entity Name</StyledTableCell>
                <StyledTableCell>Project Name</StyledTableCell>
                <StyledTableCell>Client Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Duration (hrs)</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Remark</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <b>No records</b> found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#e0e0e0" : "#ffffff",
                      "& td, & th": {
                        borderBottom: `1px solid ${
                          index % 2 === 0 ? "white" : "#e0e0e0"
                        }`,
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.employeeFirstName}</TableCell>
                    <TableCell>{item.entityName}</TableCell>
                    <TableCell>{item.projectName}</TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>
                      {item.duration}
                    </TableCell>
                    <TableCell>{item.statusName}</TableCell>
                    <TableCell>{item.remarks}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
