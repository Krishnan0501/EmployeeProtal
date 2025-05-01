import React, { useState, useMemo } from "react";
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { tableCellClasses } from "@mui/material/TableCell";

// Styled Table Row with Zebra stripes and hover effect
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5", // Light grey for odd rows as a fallback
  },
  "&:hover": {
    backgroundColor: "#e0f7fa", // Light cyan for hover effect
    cursor: "pointer",
  },
}));

// Styled Table Header Cell (Purple Header)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#842988", // Purple header
    color: "#ffffff",
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


export const EmployeesTimeSheet = ({ teamData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(25); // Number of rows per page


  // const teamData = teamData
  const filteredTeamData = useMemo(() => {
    if (!teamData || teamData.length === 0) return [];

    if (!searchQuery.trim()) return teamData;



    const searchTerms = searchQuery
      .split(",")
      .map((term) => term.trim().toLowerCase());

    return teamData
      .filter((entry) => {
        // First, check employee-level fields for a match
        const employeeMatch = searchTerms.some(
          (term) =>
            entry.name?.toLowerCase().includes(term) ||
            entry.date?.toLowerCase().includes(term) ||
            entry.duration?.toString().includes(term)
        );

        // If no employee match, check tasks
        if (!employeeMatch) {
          return entry.data.some((task) =>
            searchTerms.some((term) =>
              [
                task.projectName,
                task.entityName,
                task.technologyName,
                task.description,
                task.remarks,
                task.statusName,
                task.taskName,
              ].some((field) => field?.toLowerCase().includes(term))
            )
          );
        }

        return true;
      })
      .map((entry) => {
        // Always filter tasks based on the search terms
        const filteredTasks = entry.data.filter((task) =>
          searchTerms.some((term) =>
            [
              task.projectName,
              task.entityName,
              task.technologyName,
              task.description,
              task.remarks,
              task.statusName,
              task.taskName,
            ].some((field) => field?.toLowerCase().includes(term))
          )
        );

        return {
          ...entry,
          data: filteredTasks.length > 0 ? filteredTasks : entry.data, // Only include tasks that match
        };
      });
  }, [teamData, searchQuery]);

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  // Paginate the filtered data
  const paginatedData = useMemo(() => {
    return filteredTeamData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredTeamData, page, rowsPerPage]);
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year.slice(
      -2
    )}`; // Ensure 2-digit day/month & 2-digit year
  };
  return (
    <Paper sx={{ marginTop: 0, padding: 2 }}>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Employees Timesheet
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box> */}

      <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#7D287D", margin: "0px 10px" }}>
              <StyledTableCell
                colSpan={11}
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
              <StyledTableCell sx={{ width: "8%" }}>Name</StyledTableCell>
              <StyledTableCell sx={{ width: "8%" }}>Date</StyledTableCell>
              <StyledTableCell>Entity Name</StyledTableCell>
              <StyledTableCell>Project Name</StyledTableCell>
              <StyledTableCell>Client Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Duration (hrs)</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Task Status</StyledTableCell>
              <StyledTableCell>Remark</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTeamData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <b> No records </b>found
                </TableCell>
              </TableRow>
            ) : (
              filteredTeamData.map((entry, dateIndex) => {
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
                              {entry.name}
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
                        colSpan={6}
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
        </Table>
      </TableContainer>


      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTeamData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
// Sample team data
// const teamData = [
//   {
//     name: "Loki",
//     date: "2025-04-17",
//     duration: 6,
//     data: [
//       {
//         workId: 1,
//         projectName: "HR App",
//         entityName: "Payroll",
//         technologyName: "React",
//         description: "Implemented login",
//         remarks: "Done",
//         statusName: "Completed",
//         taskName: "Frontend Dev",
//       },
//       {
//         workId: 2,
//         projectName: "HR App",
//         entityName: "Payroll",
//         technologyName: "React",
//         description: "Timesheet screen",
//         remarks: "Ongoing",
//         statusName: "In Progress",
//         taskName: "UI Work",
//       },
//     ],
//   },
//   {
//     name: "Ram",
//     date: "2025-04-17",
//     duration: 4,
//     data: [
//       {
//         workId: 3,
//         projectName: "Admin Portal",
//         entityName: "Management",
//         technologyName: "Angular",
//         description: "Dashboard fixes",
//         remarks: "Partial",
//         statusName: "In Review",
//         taskName: "Bug Fixes",
//       },
//     ],
//   },
// ];