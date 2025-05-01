import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { updateCredintial } from "../Pages/api.js";

export const ChangePassword = ({
  onLoginSuccess,
  credintial,
  setCredintial,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();
  const { password } = useParams();
  const oldPassword = password;

  // ✅ Password Validation Function
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  // ✅ API Call Function
  const updateCred = async (cred) => {
    try {
      console.log("📤 Sending Payload:", cred);
      const data = await updateCredintial(cred);
      console.log("✅ Password updated successfully!", data);
      alert("Password updated successfully!");
      onLoginSuccess();
    } catch (error) {
      console.error(
        "❌ Password Update Failed:",
        error.response?.data || error.message
      );
      if (error.response?.data) {
        alert(`⚠️ ${error.response.data.responseMessage}`);
      } else {
        alert("⚠️ Something went wrong. Please try again.");
      }
    }
  };

  // ✅ Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error messages
    setNewPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    // ✅ New Password Validation
    if (!newPassword) {
      setNewPasswordError("New password is required!");
      isValid = false;
    } else if (!isValidPassword(newPassword)) {
      setNewPasswordError("Must be 8+ characters, 1 uppercase, 1 number.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password!");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      isValid = false;
    }

    if (isValid) {
      const updatedCred = { ...credintial, password: newPassword };

      console.log("📤 Final Payload:", updatedCred);

      updateCred(updatedCred);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 6, textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Old Password"
            type="text"
            variant="outlined"
            fullWidth
            value={oldPassword}
            InputProps={{ readOnly: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!newPasswordError}
            helperText={newPasswordError}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Change Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
