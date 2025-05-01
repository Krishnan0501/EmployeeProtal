import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createRole, getAllRoles, updateRole } from "../api"; // ✅ API functions

const AddRole = () => {
  const navigate = useNavigate();
  const { operation, roleId } = useParams();
  const isEdit = operation === "edit";
  const isView = operation === "view";

  const [roleData, setRoleData] = useState({
    roleCode: "",
    roleName: "",
    status: "Active", 
  });

  // ✅ State for Popup Dialog
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "info", 
  });

  // ✅ Function to show Popup
  const showPopup = (message, severity = "info") => {
    setPopup({ open: true, message, severity });
  };

  // ✅ Function to close Popup
  const handleClosePopup = () => {
    setPopup({ ...popup, open: false });
  };

  // ✅ Load role when in Edit/View mode
  useEffect(() => {
    if (isEdit || isView) {
      const fetchRole = async () => {
        try {
          const allRoles = await getAllRoles(); // ✅ Fetch all roles
          const role = allRoles.find((r) => r.roleId.toString() === roleId); // ✅ Find role by ID
          if (role) {
            setRoleData({
              roleCode: role.roleCode,
              roleName: role.roleName,
              status: role.status ? "Active" : "Inactive", // ✅ Convert to string
            });
          } else {
            showPopup("Role not found.", "error");
            navigate("/"); // ✅ Redirect if role not found
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          showPopup("Failed to load role details.", "error");
        }
      };
      fetchRole();
    }
  }, [roleId, isEdit, isView, navigate]);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };

  // ✅ Handle role save/update
  const handleSave = async () => {
    if (!roleData.roleCode || !roleData.roleName) {
      showPopup("Both Role Code and Role Name are required.", "warning");
      return;
    }

    try {
      if (isEdit) {
        await updateRole(roleId, {
          ...roleData,
          status: roleData.status === "Active",
        }); // ✅ Convert status back to boolean
        showPopup("Role updated successfully!", "success");
      } else {
        await createRole({
          ...roleData,
          status: roleData.status === "Active",
        }); // ✅ Convert status before sending
        showPopup("Role created successfully!", "success");
      }
      setTimeout(() => navigate("/"), 2000); // ✅ Redirect after save
    } catch (error) {
      console.error("Error saving role:", error);
      showPopup(
        "Failed to save role. " +
          (error.response?.data?.responseMessage || error.message),
        "error"
      );
    }
  };

  const handleClear = () => {
    setRoleData({ roleCode: "", roleName: "", status: "Active" });
  };

  return (
    <>
      <Box
        sx={{
          width: "90%", // ✅ Responsive width
          maxWidth: 600, // ✅ Limits max width
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
            p: { xs: 2, sm: 4 }, // ✅ Responsive padding
            boxShadow: 3,
            border: "1px solid #333",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
            {isEdit ? "Edit Role" : isView ? "View Role" : "Add Role"}
          </Typography>

          <Stack spacing={2}>
            {/* Role Code */}
            <TextField
              label="Role Code"
              name="roleCode"
              value={roleData.roleCode}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputProps={{ readOnly: isView }}
            />

            {/* Role Name */}
            <TextField
              label="Role Name"
              name="roleName"
              value={roleData.roleName}
              onChange={handleInputChange}
              fullWidth
              size="small"
              InputProps={{ readOnly: isView }}
            />

            {/* Status Dropdown */}
            {/* <TextField
              label="Status"
              name="status"
              value={roleData.status} // ✅ Bind value
              onChange={handleInputChange}
              select
              fullWidth
              size="small"
              disabled={isView}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField> */}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            {!isView && (
              <Button variant="contained" color="success" onClick={handleSave}>
                {isEdit ? "Update" : "Save"}
              </Button>
            )}
            {!isView && (
              <Button variant="outlined" onClick={handleClear}>
                Clear
              </Button>
            )}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* ✅ Popup Dialog */}
      <Dialog
        open={popup.open}
        onClose={handleClosePopup}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "350px", // Ensures proper size
            textAlign: "center",
            padding: "20px",
          },
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

export default AddRole;
