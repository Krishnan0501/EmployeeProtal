import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { updateRole } from "../api"; // ✅ Import API function

const EditRole = () => {
  const navigate = useNavigate();
  const { operation, roleId } = useParams(); // ✅ Get operation type & role ID from URL
  const location = useLocation(); // ✅ Get passed role data

  // ✅ State for role data
  const [roleData, setRoleData] = useState({
    roleCode: "",
    roleName: "",
    status: "Active", // Default value
  });

  // ✅ State for Snackbar (Popup)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ State for Dialog Popup
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Function to Show Popup
  const showPopup = (message, severity = "info") => {
    setPopup({ open: true, message, severity });
  };

  // Function to Close Popup
  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  // ✅ Load role data when the component mounts
  useEffect(() => {
    if (location.state?.roleData) {
      const role = location.state.roleData;
      console.log("Loaded Role Data:", role); // Debugging Log

      setRoleData({
        roleCode: role.roleCode,
        roleName: role.roleName,
        status: role.status ? "Active" : "Inactive",
      });
    }
  }, [location.state]);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };

  // ✅ Handle role update
  const handleUpdateRole = async () => {
    if (!roleData.roleCode || !roleData.roleName) {
      showPopup("Role Code and Role Name are required.", "warning");
      return;
    }

    const updatedRoleData = {
      roleCode: roleData.roleCode,
      roleName: roleData.roleName,
      status: roleData.status === "Active",
    };

    console.log(
      "Updating Role with Data:",
      updatedRoleData,
      "Role ID:",
      roleId
    );

    try {
      const response = await updateRole(roleId, updatedRoleData);
      console.log("Update API response:", response);

      if (response?.data?.responseCode === "200") {
        showPopup("Role updated successfully!", "success");
        setTimeout(() => navigate("/"), 2000);
      } else {
        showPopup("Failed to update role", "error");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showPopup("Error updating role. Please try again.", "error");
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "90%",
          maxWidth: 600,
          mx: "auto",
          my: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            p: { xs: 2, sm: 4 },
            border: "1px solid #333",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
            {operation.toLowerCase() === "edit" ? "Edit Role" : "View Role"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Role Code"
              name="roleCode"
              value={roleData.roleCode}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputLabelProps={{
                sx: { fontWeight: "bold" }, // ✅ Makes the label bold
              }}
              InputProps={{ readOnly: operation.toLowerCase() === "view" }}
            />

            <TextField
              label="Role Name"
              name="roleName"
              value={roleData.roleName}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputProps={{ readOnly: operation.toLowerCase() === "view" }}
              InputLabelProps={{
                sx: { fontWeight: "bold" }, // ✅ Makes the label bold
              }}
            />
            {operation.toLowerCase() === "view" ? (
              <TextField
                label="Status"
                name="status"
                value={roleData.status}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                InputLabelProps={{
                  sx: { fontWeight: "bold" }, // ✅ Makes the label bold
                }}
              />
            ) : (
              <TextField
                label="Status"
                name="status"
                value={roleData.status}
                onChange={handleInputChange}
                select
                fullWidth
                size="small"
                InputLabelProps={{
                  sx: { fontWeight: "bold" }, // ✅ Makes the label bold
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            {operation.toLowerCase() === "edit" && (
              <Button
                variant="contained"
                color="success"
                onClick={handleUpdateRole}
              >
                Save
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate("/")}>
              Back
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* ✅ Centered Dialog Popup */}
      <Dialog
        open={popup.open}
        onClose={handleClosePopup}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "350px",
            textAlign: "center",
            padding: "20px",
          },
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
      </Dialog>
    </>
  );
};

export default EditRole;
