import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Radio from "@mui/material/Radio";
import "./RoleTable.css";

// ✅ Styled Table Row with zebra stripes, hover and selection
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.Mui-selected": {
    backgroundColor: "#b2ebf2",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#b2ebf2",
  },
  "&:hover": {
    backgroundColor: "#e0f7fa",
    cursor: "pointer",
  },
  height: 28, // Apply consistent height
  "& .MuiTableCell-root": {
    padding: "4px 8px",
    fontSize: "0.85rem",
    lineHeight: 1.2,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#842988",
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function RoleTable({
  roles = [], // ✅ Default empty array to prevent errors
  setEditRoleData,
  setSelectedRoleId,
  setSelectedRoleIndex,
  selectedRoleId,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // ✅ Handler for selecting/deselecting a role
  const handleSelectRole = (role, index, finalRoleId) => {
    if (selectedRoleId === finalRoleId) {
      // Deselect if already selected
      setSelectedRoleId(null);
      setSelectedRoleIndex(null);
      setEditRoleData({});
      console.log("Deselected:", role);
    } else {
      // Select new role
      setSelectedRoleId(finalRoleId);
      setSelectedRoleIndex(page * rowsPerPage + index);
      setEditRoleData(role);
      console.log("Selected:", role);
    }
  };

  // ✅ Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Ensure page is within bounds when roles change
  React.useEffect(() => {
    if (page > Math.ceil(roles.length / rowsPerPage) - 1) {
      setPage(0);
    }
  }, [roles.length, page, rowsPerPage]);

  // ✅ Sliced roles for current page
  const paginatedRoles = roles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      sx={{
        width: "100%",
        minWidth: 0,
        margin: "0 auto",
        marginTop: -2,
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ minHeight: 30 }}>
              <StyledTableCell>Select Role</StyledTableCell>
              {/* <StyledTableCell>S.No</StyledTableCell> */}
              <StyledTableCell>Role Code</StyledTableCell>
              <StyledTableCell>Role Name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRoles.map((role, index) => {
              const finalRoleId = role ?? `${page}-${index}`; // Ensure unique ID fallback

              return (
                <StyledTableRow
                  key={finalRoleId}
                  onClick={() => handleSelectRole(role, index, finalRoleId)}
                  selected={selectedRoleId === finalRoleId}
                >
                  <StyledTableCell>
                    <Radio
                      checked={selectedRoleId === finalRoleId}
                      onChange={() =>
                        handleSelectRole(role, index, finalRoleId)
                      }
                      value={finalRoleId}
                      name="select-role"
                      color="primary"
                    />
                  </StyledTableCell>
                  {/* <StyledTableCell>
                    {page * rowsPerPage + index + 1}
                  </StyledTableCell> */}
                  <StyledTableCell>{role.roleCode || "N/A"}</StyledTableCell>
                  <StyledTableCell>{role.roleName || "N/A"}</StyledTableCell>
                  <StyledTableCell>
                    {role.status == true ? "Active" : "Inactive"}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={roles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
