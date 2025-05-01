import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginAnimation from "../assets/Logo.jpg";
import { getCredintial } from "../Pages/api.js";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = ({
  onLoginSuccess,
  credintial,
  setCredintial,
  setEmployeeData,
}) => {
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [response, setResponse] = useState(null); //  Response is initially null
  const [showTooltip, setShowTooltip] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //  Validation Functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  //  Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredintial((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //  Fetch Credential API
  const fetchCred = async (cred) => {
    try {
      setModalMessage("Logging in...");
      setOpenModal(true);

      const data = await getCredintial(cred);
      console.log("API Response:", data);

      if (data?.responseCode === "200" && data.data) {
        setResponse(data.data);
        setEmployeeData(data.data);
        sessionStorage.setItem("token", data.data.jwtToken);
        sessionStorage.setItem("employeeId", data.data.employeeId);
        sessionStorage.setItem("EmployeeData", JSON.stringify(data.data));
        sessionStorage.setItem(
          "screenAccess",
          JSON.stringify(data.data.screenAccess)
        );
        setOpenModal(false);
      } else if (data?.responseCode === "400") {
        setResponse(null);
        setModalMessage(data.responseMessage);
      } else {
        setResponse(null);
        setPasswordError("Incorrect password");
        setModalMessage("❌ Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        setModalMessage(`⚠️ ${error.response.data.responseMessage}`);
      } else {
        setModalMessage("⚠️ Something went wrong. Please try again.");
      }
    }
  };

  //  Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const { emailId, password } = credintial;

    let isValid = true;

    //  Email Validation
    if (!emailId) {
      setEmailError("⚠️ Email is required!");
      isValid = false;
    } else if (!isValidEmail(emailId)) {
      setEmailError("⚠️ Please enter a valid email address.");
      isValid = false;
    }

    //  Password Validation
    if (!password) {
      setPasswordError("⚠️ Password is required!");
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "⚠️ Password must be 8 chars, 1 uppercase, and 1 number."
      );
      isValid = false;
    }

    //  Call API if Valid
    if (isValid) {
      fetchCred(credintial);
    }
  };

  //  Handle Redirect After Login
  useEffect(() => {
    console.log("🔥 useEffect triggered. Response:", response);

    if (response && typeof response === "object") {
      if (response.firstlogin === true) {
        console.log("🔑 First Login Detected! Redirecting...");
        navigate(`/change-password/${credintial.password}`);
      } else {
        console.log("✅ Login successful, redirecting...");
        onLoginSuccess();
        navigate("/");
        setTimeout(() => {
          setCredintial({ emailId: "", password: "" });
        }, 500);
      }
    }
  }, [response]);
  // Removed credintial.password
  useEffect(() => {
    // const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    // const entityId = employeeData?.entityId;
    // const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | Login`;
  }, []);
  //  Handle Clear
  const handleClear = () => {
    setCredintial({
      emailId: "",
      password: "",
    });
    setEmailError("");
    setPasswordError("");
  };

  return (
    <>
      <div className="container">
        <div className="Image_col">
          <img
            src={loginAnimation}
            alt="Login Animation"
            className="login-gif"
          />
        </div>
        <div className="login_col">
          <h2>Portal Login</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="emailId"
              placeholder="Enter your email"
              value={credintial.emailId}
              onChange={handleChange}
            />
            {emailError && <p className="error-msg">{emailError}</p>}
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              Password
              <span
                className="tooltip-icon"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpOutlineIcon />
                {showTooltip && (
                  <div className="tooltip-box">
                    <strong>Password must contain:</strong>
                    <ul>
                      <li>At least 8 characters</li>
                      <li>1 uppercase letter</li>
                      <li>1 Speacial character</li>
                      <li>1 number</li>
                    </ul>
                  </div>
                )}
              </span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credintial.password}
                onChange={handleChange}
              // style={{ width: "100%", paddingRight: "40px" }}
              />
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
              // style={{
              //   position: "absolute",
              //   right: "10px",
              //   top: "50%",
              //   transform: "translateY(-50%)",
              // }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>

            {passwordError && <p className="error-msg">{passwordError}</p>}

            <div className="button">
              <button type="submit" className="submit">
                Login
              </button>
              <button type="button" className="clear" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Login Status</DialogTitle>
        <DialogContent>
          {modalMessage === "Logging in..." ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircularProgress size={20} />
              <span>{modalMessage}</span>
            </div>
          ) : (
            <p>{modalMessage}</p>
          )}
        </DialogContent>
        {modalMessage !== "Logging in..." && (
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};
