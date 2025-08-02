import React, { useEffect, useState } from "react";
import logo from "../assets/logo.ico";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-phone-input-2/lib/material.css";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Link,
  Grid,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

const Onboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [meta, setMeta] = useState({
    ip: "",
    browser: "",
    device: "",
    submitted: false,
    submitting: false,
  });

  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const savedTime = localStorage.getItem("onboard_time");
    const savedEmail = localStorage.getItem("onboard_email");
    const savedName = localStorage.getItem("onboard_name");
  
    if (savedTime && savedEmail && savedName) {
      const diff = Date.now() - parseInt(savedTime);
      const hours = diff / (1000 * 60 * 60);
  
      if (hours < 24) {
        const nameEncoded = encodeURIComponent(savedName);
        const emailEncoded = encodeURIComponent(savedEmail);
        navigate(`/invite?name=${nameEncoded}&email=${emailEncoded}`);
        return;
      }
    }
  
    fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setMeta((prev) => ({ ...prev, ip: data.ip })))
      .catch(() => setMeta((prev) => ({ ...prev, ip: "Unavailable" })));
  
    setMeta((prev) => ({
      ...prev,
      browser: navigator.userAgent,
      device: navigator.platform,
    }));
  }, []);
  
  const formik = useFormik({
    initialValues: { fullName: "", email: "", agreed: false },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      agreed: Yup.boolean().oneOf([true], "Please accept the terms"),
    }),
    onSubmit: async (values) => {
      setMeta((m) => ({ ...m, submitting: true }));
      const payload = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        ip: meta.ip,
        browserInfo: meta.browser,
        deviceInfo: meta.device,
      };
  
      try {
        const res = await api.post("/onboard", payload);
        const data = res.data;
  
  
        // ✅ Save values in localStorage for 24-hour logic
        localStorage.setItem("onboard_time", Date.now().toString());
        localStorage.setItem("onboard_email", values.email.trim());
        localStorage.setItem("onboard_name", values.fullName.trim());
  
        setMeta((m) => ({ ...m, submitted: true }));
  
        // ✅ Navigate to Invite page
        const nameEncoded = encodeURIComponent(values.fullName.trim());
        const emailEncoded = encodeURIComponent(values.email.trim());
        setTimeout(() => navigate(`/invite?name=${nameEncoded}&email=${emailEncoded}`), 2000);
      } catch (err) {
        console.error(err.message);
        alert("Submission failed. Please try again.");
      } finally {
        setMeta((m) => ({ ...m, submitting: false }));
      }
    },
  });
  

  if (meta.submitted) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={2}
        >
          <Paper elevation={4} sx={{ p: 6, borderRadius: 4, textAlign: "center" }}>
            <Avatar src={logo} alt="Logo" sx={{ width: 72, height: 72, mx: "auto", mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Thank you!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your details have been received. Redirecting...
            </Typography>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        minHeight="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={1}
        bgcolor="background.default"
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 600,
            width: "100%",
            p: isMobile ? 3 : 5,
            borderRadius: 4,
          }}
        >
          {/* Dark mode toggle */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Avatar
              src={logo}
              alt="Logo"
              sx={{ width: 96, height: 96, mx: "auto", mb: 1 }}
            />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Welcome to J5 Secure Chat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please follow the steps below to onboard securely.
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              size="small"
              sx={{ mb: 2 }}
              InputProps={{ sx: { height: 50, fontSize: 14 } }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              size="small"
              sx={{ mb: 3 }}
              InputProps={{ sx: { height: 50, fontSize: 14 } }}
            />

            <Box mb={3} p={2} bgcolor={darkMode ? "#1e1e1e" : "#f9f9f9"} borderRadius={2}>
              <Typography variant="body2" gutterBottom>
                <strong>IP:</strong> {meta.ip}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Browser:</strong> {meta.browser}
              </Typography>
              <Typography variant="body2">
                <strong>Device:</strong> {meta.device}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreed"
                  checked={formik.values.agreed}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link href="/terms" underline="hover">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" underline="hover">
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              }
            />

            {formik.touched.agreed && formik.errors.agreed && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {formik.errors.agreed}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={meta.submitting}
              sx={{ mt: 3, height: 48, fontWeight: "bold", textTransform: "none" }}
            >
              {meta.submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Onboard;
