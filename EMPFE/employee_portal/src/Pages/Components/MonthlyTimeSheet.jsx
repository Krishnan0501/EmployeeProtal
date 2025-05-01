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
  Autocomplete,
  Box, Typography,
  CircularProgress
} from "@mui/material";
import { postDownload, getMonthReport } from "../../Pages/api.js";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 16px",
  fontSize: 12,
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#842988",
  color: theme.palette.common.white,
}));

export const MonthlyTimeSheet = () => {
  let emp = sessionStorage.getItem("employeeId");
  emp = parseInt(emp);
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
  const years = Array.from({ length: 31 }, (_, i) => (2000 + i).toString());

  // ✅ Get Current Month & Year
  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear().toString();

  const [searchQuery, setSearchQuery] = useState("");

  const [loadingTasks, setLoadingTasks] = useState(false);
  // ✅ Default selection: current month & year
  const [mon, setMon] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [request, setRequest] = useState({
    month: months.indexOf(currentMonth) + 1,
    year: parseInt(currentYear, 10),
  });

  const [page, setPage] = useState(0); // Pagination: Current Page
  const [rowsPerPage, setRowsPerPage] = useState(25); // Pagination: Rows per Page

  const filteredData = data.filter((entry) => {
    const entryDate = new Date(entry.date);
    const entryMonth = months[entryDate.getMonth()];
    const entryYear = entryDate.getFullYear().toString();

    return entryMonth === mon && entryYear === year;
  });

  const getRepost = async (request) => {
    console.log("request : ", JSON.stringify(request));
    try {
      const blob = await postDownload({
        ...request,
        employeeId: [emp], // keep as array
      });
      if (!blob) {
        console.error("❌ Download failed. No data received.");
        return;
      }

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentMonth} Monthly_TimeSheet.xlsx`;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("❌ Error in downloading:", error);
    }
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ✅ Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.slice(
      -2
    )}`; // Ensure 2-digit day/month & 2-digit year
  };

  const fetchMonthData = async (req) => {
    setLoadingTasks(true)
    try {
      const response = await getMonthReport({
        ...request,
        employeeId: emp, // use int
      });
      console.log("Data : ", response.data)
      setData(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch task updates:", error.message);
      setResponse([]); // Ensure response is never null
    }
    setLoadingTasks(false)
  };
  // useEffect(() => {
  //   fetchMonthData(request);
  // }, []);
  useEffect(() => {
    const updatedRequest = {
      ...request,
      month: months.indexOf(mon) + 1, // Convert month name to number
      year: parseInt(year, 10),
    };

    setRequest(updatedRequest);
    fetchMonthData(updatedRequest); // 🔹 Fetch new data when month/year changes
  }, [mon, year]); // 🔹 Dependency array includes `mon` & `year`

  const filteredMonthData = useMemo(() => {
    if (!searchQuery) return filteredData;

    const searchTerms = searchQuery
      .split(",")
      .map((term) => term.trim().toLowerCase());

    return filteredData
      .map((entry) => {
        // Safe check for undefined fields before .toLowerCase()
        const employeeName = entry.employee ? entry.employee.toLowerCase() : "";
        const entryDate = entry.date ? entry.date.toLowerCase() : "";

        // Check if employee or date matches
        const dateMatch = searchTerms.some((term) => entryDate.includes(term));

        // Ensure entry.data exists before filtering
        const filteredTasks = Array.isArray(entry.data)
          ? entry.data.filter((task) =>
            searchTerms.some((term) =>
              [
                task.projectName,
                task.entityName,
                task.clientName,
                task.description,
                task.duration,
                task.statusName,
                task.taskName,
              ]
                .map((val) =>
                  typeof val === "string"
                    ? val.toLowerCase()
                    : val != null
                      ? String(val).toLowerCase()
                      : ""
                )
                // Handle undefined fields
                .some((text) => text.includes(term))
            )
          )
          : [];

        if (dateMatch || filteredTasks.length > 0) {
          return {
            ...entry,
            data: dateMatch ? entry.data : filteredTasks, // Only replace if no direct match
          };
        }

        return null;
      })
      .filter(Boolean); // Remove null values
  }, [searchQuery, filteredData]);
  return (
    <Paper sx={{ marginTop: -4, padding: 2 }}>
      {/* 🔻 Searchable Month & Year Dropdowns */}
      <div style={{ display: "flex", gap: "10px", margin: "15px" }}>
        <h2>📅 Monthly TimeSheet</h2>
        <></>
        {/* 🔍 Month Dropdown (Searchable) */}
        <Autocomplete
          size="small"
          fullWidth
          sx={{ width: 150 }}
          options={months}
          value={mon}
          onChange={(event, newValue) => {
            setMon(newValue);
            setRequest((prev) => ({
              ...prev,
              month: months.indexOf(newValue) + 1, // Convert month name to number
            }));
          }}
          renderInput={(params) => <TextField {...params} label="Month" />}
        />

        {/* 🔍 Year Dropdown (Searchable) */}
        <Autocomplete
          size="small"
          fullWidth
          options={years}
          sx={{ width: 150 }}
          value={year}
          onChange={(event, newValue) => setYear(newValue)}
          renderInput={(params) => <TextField {...params} label="Year" />}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => getRepost(request)}
        >
          <DownloadIcon />
        </Button>
      </div>

      {/* 📌 TimeSheet Table */}
      <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
        {loadingTasks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading data...</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#7D287D", margin: "0px 10px" }}>
                <StyledTableCell
                  colSpan={10}
                  sx={{ padding: "8px", backgroundColor: "transparent" }}
                >
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
                          <SearchIcon sx={{ color: "#7D287D" }} />{" "}
                          {/* Purple icon */}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: "transparent", // ✅ Fix background
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" }, // Remove border
                        backgroundColor: "transparent", // ✅ Ensure it's transparent
                      },
                      input: { color: "white" }, // ✅ Make text color white
                    }}
                  />
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: "0px 10px" }}>
                <StyledTableCell>S.No</StyledTableCell>
                <StyledTableCell sx={{ width: "8%" }}>Date</StyledTableCell>
                <StyledTableCell>Entity Name</StyledTableCell>
                <StyledTableCell>Project Name</StyledTableCell>
                <StyledTableCell sx={{ width: "8%" }}>Client Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Duration (hrs)</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Task Status</StyledTableCell>
                <StyledTableCell>Remark</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredMonthData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <b> No records </b>found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMonthData.map((entry, dateIndex) => {
                  // Define alternating zebra colors
                  const bgColor = dateIndex % 2 === 0 ? "#e0e0e0" : "#ffffff"; // Light Gray & White

                  return (
                    <React.Fragment key={dateIndex}>
                      {entry.data.map((item, subIndex) => (
                        <TableRow
                          key={`${dateIndex}-${subIndex}`}
                          sx={{
                            backgroundColor: `${bgColor} !important`,
                            "& td, & th": {
                              backgroundColor: `${bgColor} !important`,
                              borderBottom: `1px solid ${dateIndex % 2 === 0 ? "white" : "#e0e0e0"
                                } !important`, // White borders on grey rows
                            },
                          }}
                        >
                          {/* Show Date & Serial Number only once per date */}
                          {subIndex === 0 && (
                            <>
                              <TableCell
                                rowSpan={entry.data.length}
                                sx={{
                                  backgroundColor: `${bgColor} !important`,
                                  fontWeight: "bold",
                                }}
                              >
                                {dateIndex + 1}
                              </TableCell>
                              <TableCell
                                rowSpan={entry.data.length}
                                sx={{
                                  backgroundColor: `${bgColor} !important`,
                                  fontWeight: "bold",
                                }}
                              >
                                {formatDate(entry.date)}
                              </TableCell>
                            </>
                          )}
                          <TableCell>{item.companyName}</TableCell>
                          <TableCell>{item.projectName}</TableCell>
                          <TableCell>{item.clientName}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {item.duration}
                          </TableCell>
                          <TableCell>{item.statusName}</TableCell>
                          <TableCell>{item.taskName}</TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      ))}

                      {/* 🔻 NEW ROW for Total Duration */}
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{ backgroundColor: "#d1c4e9 !important" }}
                        />
                        <TableCell
                          sx={{
                            backgroundColor: "#d1c4e9 !important",
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          Total Duration:
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#d1c4e9 !important",
                            fontWeight: "bold",
                            textAlign: "end",
                          }}
                        >
                          {entry.duration != null
                            ? Number(entry.duration).toFixed(1)
                            : ""}
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          sx={{ backgroundColor: "#d1c4e9 !important" }}
                        />
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>)}
      </TableContainer>

      {/* 🔹 Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Choose number of rows per page
        component="div"
        count={filteredData.length} // Total rows
        rowsPerPage={rowsPerPage} // Rows per page
        page={page} // Current page
        onPageChange={handleChangePage} // Change page
        onRowsPerPageChange={handleChangeRowsPerPage} // Change rows per page
      />
    </Paper>
  );
};
