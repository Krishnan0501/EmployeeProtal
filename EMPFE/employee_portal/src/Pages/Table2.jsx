import "./Table2.css";
// import React, { useState } from "react";
import RoleTable from "./Components/Roletable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

import {
  getAllRoles,
  createRole,
  deleteRole,
  updateRole,
  searchRoles,
} from "./api.js";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 1 Correct import
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export const Table2 = () => {
  const navigate = useNavigate();
  const [roleCode, setRoleCode] = useState("");
  const [roleName, setRoleName] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModelOpenEdit, setIsModelOpenEdit] = useState(false);
  const [roleData, setRoleData] = useState({
    roleCode: "",
    roleName: "",
    IsActive: true,
  });
  const [editRoleData, setEditRoleData] = useState({
    id: "",
    roleCode: "",
    roleName: "",
    IsActive: true,
    operation: "Edit",
  });
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(null);
  // const [roles, setRoles] = useState([
  //   { id: 1, roleCode: "ADMIN", roleName: "Administrator", status: "Active" },
  //   { id: 2, roleCode: "EMP", roleName: "Employee", status: "Inactive" },
  //   { id: 3, roleCode: "HR", roleName: "HR Manager", status: "Active" },
  //   { id: 4, roleCode: "MAN", roleName: "Manager", status: "Active" },
  //   { id: 5, roleCode: "DEV", roleName: "Developer", status: "Active" },
  //   { id: 6, roleCode: "ACC", roleName: "Accountant", status: "Inactive" },
  //   { id: 7, roleCode: "SUP", roleName: "Support", status: "Active" },
  //   { id: 8, roleCode: "QA", roleName: "Quality Analyst", status: "Active" },
  //   { id: 9, roleCode: "ENG", roleName: "Engineer", status: "Active" },
  //   { id: 10, roleCode: "TEST", roleName: "Tester", status: "Inactive" },
  //   {
  //     id: 11,
  //     roleCode: "ADMIN2",
  //     roleName: "Administrator 2",
  //     status: "Active",
  //   },
  //   { id: 12, roleCode: "EMP2", roleName: "Employee 2", status: "Inactive" },
  // ]);
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data.data);
      console.log("Fetched roles:", data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Call once on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    const newRole = {
      roleCode: roleData.roleCode,
      roleName: roleData.roleName,
      status: roleData.IsActive ? 1 : 0, // Backend expects tinyint (1 or 0)
    };

    try {
      // Call backend to create role
      const response = await createRole(newRole);
      console.log("Role created on backend:", response);

      // Now, update the frontend state to include new role
      const createdRole = {
        id: roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1, // Frontend ID for tracking (optional if backend returns ID)
        roleCode: newRole.roleCode,
        roleName: newRole.roleName,
        status: newRole.status === 1 ? "Active" : "Inactive", // Convert numeric status to string for display
      };

      setRoles((prevRoles) => [...prevRoles, createdRole]);
      setIsModelOpen(false); // Close modal

      await fetchRoles();
      console.log("Role created and added to list:", createdRole);
    } catch (error) {
      console.error("Failed to create role:", error);
      alert(
        "Failed to create role: " +
          (error.response?.data?.responseMessage || error.message)
      );
    }
  };

  const handleDeleteRole = async () => {
    console.log("Deleting role:", editRoleData);
    console.log("Role ID:", editRoleData.roleId); // 1 Correct roleId

    try {
      const response = await deleteRole(editRoleData.roleId); // API call

      console.log("Delete API response:", response); // Check response structure
      console.log(editRoleData);
      if (response.data.responseCode === "200") {
        // 1 Filter out the deleted role
        const updatedRoles = roles.filter(
          (role) => role.id !== editRoleData.roleId
        );
        setRoles(updatedRoles);

        // 1 Close modal and reset form
        setIsModelOpenEdit(false);
        setEditRoleData({
          roleId: "",
          roleCode: "",
          roleName: "",
          status: true,
          operation: "Edit",
        });
      } else {
        alert(
          (response && response.responseMessage) || "Failed to delete role"
        );
      }
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("An error occurred while deleting the role. Please try again.");
    }
  };

  // ✅ State for Popup Dialog
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "info", // Can be "success", "error", "warning"
  });

  // ✅ Function to show Popup
  const showPopup = (message, severity = "info") => {
    setPopup({ open: true, message, severity });
  };

  // ✅ Function to close Popup
  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission refresh

    if (!roleCode.trim() && !roleName.trim()) {
      showPopup("Please enter Role Code or Role Name to search.");
      return;
    }

    try {
      const searchPayload = {
        roleCode: roleCode,
        roleName: roleName,
      };

      const result = await searchRoles(
        searchPayload.roleCode,
        searchPayload.roleName
      );

      console.log("Result:", result);
      console.log("Roles data:", result.data);

      if (result.data.length > 0) {
        setRoles(result.data);
      } else {
        showPopup("Role not found.", "error");
        setRoles([]); // Clear table if no results
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      showPopup("Failed to search roles!");
    }
  };

  const handleClear = async () => {
    await fetchRoles();
    setRoleCode("");
    setRoleName("");
  };

  const handleEditRecord = (operationType) => {
    setEditRoleData((prev) => ({ ...prev, operation: operationType }));
    setIsModelOpenEdit(true);
  };

  const handleRoleData = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };

  const handleEditRoleData = (e) => {
    setEditRoleData({ ...editRoleData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="containers">
        <Typography variant="h5" sx={{ mt: -1, mb: -2 }} gutterBottom>
          Employee Roles List
        </Typography>

        {/* Search Form */}
        <Paper
          sx={{
            padding: 1,
            pt: 0,
            mb: -1,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Search Roles
          </Typography>

          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2}>
              {/* Role Code Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role Code"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                />
              </Grid>

              {/* Role Name Input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Search & Clear Buttons */}
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
              <Button variant="outlined" color="primary" onClick={handleClear}>
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* CRUD Buttons */}

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mb: 2 }}
        >
          {/* ✅ Add Button - Goes to "Add Role" Page */}
          <Tooltip title="Add new role">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/roles/add")}
            >
              Add
            </Button>
          </Tooltip>

          {/* ✅ Edit Button - Navigates to "Edit Role" Page */}
          {/* <Tooltip title="Edit selected role">
          <span>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/roles/edit/${selectedRoleId}`)}
              disabled={!selectedRoleId}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  border: "1px solid",
                  borderColor: "primary.main",
                },
              }}
            >
              Edit
            </Button>
          </span>
        </Tooltip> */}

          {/* ✅ View Button - Navigates to "View Role" Page */}
          {/* <Tooltip title="View selected role">
          <span>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/roles/view/${selectedRoleId}`)}
              disabled={!selectedRoleId}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  border: "1px solid",
                  borderColor: "primary.main",
                },
              }}
            >
              View
            </Button>
          </span>
        </Tooltip> */}
          <Tooltip title="Edit selected role">
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => {
                  if (!selectedRoleId) {
                    alert("Please select a role to edit.");
                    return;
                  }
                  navigate(`/roles/edit/${editRoleData.roleId}`, {
                    state: { roleData: editRoleData },
                  });
                }}
                disabled={!selectedRoleId}
              >
                Edit
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="View selected role">
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={() => {
                  if (!selectedRoleId) {
                    alert("Please select a role to view.");
                    return;
                  }
                  navigate(`/roles/view/${selectedRoleId}`, {
                    state: { roleData: editRoleData },
                  });
                }}
                disabled={!selectedRoleId}
              >
                View
              </Button>
            </span>
          </Tooltip>

          {/* ✅ Delete Button (Remains the same) */}
          <Tooltip title="Delete selected role">
            <span>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DeleteIcon />}
                onClick={() => handleEditRecord("Delete")}
                disabled={!selectedRoleId}
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "white",
                    border: "1px solid",
                    borderColor: "primary.main",
                  },
                }}
              >
                Delete
              </Button>
            </span>
          </Tooltip>
        </Stack>
        {/* Role Table */}
        <RoleTable
          roles={roles}
          setEditRoleData={setEditRoleData}
          setSelectedRoleId={(id) => {
            console.log("Selected Role ID:", id); // ✅ Debugging Log
            setSelectedRoleId(id);
          }}
          setSelectedRoleIndex={setSelectedRoleIndex}
          selectedRoleId={selectedRoleId}
        />

        {/* Add Role Dialog */}

        {/* Edit/Delete Role Dialog */}

        <Dialog
          open={isModelOpenEdit}
          onClose={() => setIsModelOpenEdit(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editRoleData.operation === "Edit"
              ? "Edit Role"
              : editRoleData.operation === "View"
              ? "View Role"
              : "Delete Role"}
            <IconButton
              onClick={() => setIsModelOpenEdit(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {/* 1 EDIT MODE */}

            {/* 1 VIEW MODE */}

            {/* 1 DELETE MODE */}
            {editRoleData.operation === "Delete" && (
              <Typography>
                Are you sure to delete <b>{editRoleData.roleName}</b>?
              </Typography>
            )}
          </DialogContent>

          {/* 1 Footer Action Buttons */}
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center", // ✅ Centers buttons horizontally
              alignItems: "center", // ✅ Centers buttons vertically
            }}
          >
            {editRoleData.operation === "Delete" && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteRole}
                >
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsModelOpenEdit(false)}
                >
                  No
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
      <Dialog
        open={popup.open}
        onClose={handleClosePopup}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "350px", // Ensures proper size
            textAlign: "center",
            padding: "20px",
          },
          padding: -1,
        }}
      >
        <Box
          sx={{
            margin: 2,
            border: "1px solid #333",
            borderRadius: 2,
          }}
        >
          <DialogTitle>
            {popup.severity === "success" ? "Success" : "Info"}
          </DialogTitle>
          <DialogContent>{popup.message}</DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePopup}
              variant="contained"
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};
