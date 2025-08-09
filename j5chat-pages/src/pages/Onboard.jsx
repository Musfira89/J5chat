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
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { Link as RouterLink } from "react-router-dom";
import Bg from "../assets/Bg.png";

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

  const muiTheme = createTheme({
    palette: {
      mode: "light", // ✅ Always light mode
    },
  });

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
        await api.post("/onboard", payload);

        localStorage.setItem("onboard_time", Date.now().toString());
        localStorage.setItem("onboard_email", values.email.trim());
        localStorage.setItem("onboard_name", values.fullName.trim());

        setMeta((m) => ({ ...m, submitted: true }));

        const nameEncoded = encodeURIComponent(values.fullName.trim());
        const emailEncoded = encodeURIComponent(values.email.trim());
        setTimeout(
          () => navigate(`/invite?name=${nameEncoded}&email=${emailEncoded}`),
          2000
        );
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
          sx={{
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${Bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(7px)",
              zIndex: -2,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: -1,
            },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              boxShadow: "0 6px 30px rgba(0,0,0,0.2)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              backgroundColor: "rgba(255,255,255,0.90)",
            }}
          >
            <Avatar
              src={logo}
              alt="Logo"
              sx={{ width: 72, height: 72, mx: "auto", mb: 2 }}
            />
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
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={1}
        sx={{
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${Bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(7px)",
            zIndex: -2,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: -1,
          },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 640,
            width: "100%",
            p: 0,
            py:2,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 6px 30px rgba(0,0,0,0.2)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <Box px={5} pb={5}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Avatar
                src={logo}
                alt="Logo"
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  mt: 4,
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom={false}
                sx={{ mb: 0.5 }}
              >
                Welcome to J5 Secure Chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please follow the steps below to onboard securely.
              </Typography>
            </Box>
  
            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.fullName && Boolean(formik.errors.fullName)
                    }
                    helperText={
                      formik.touched.fullName && formik.errors.fullName
                    }
                    size="small"
                    InputProps={{ sx: { height: 48, fontSize: 14 } }}
                    InputLabelProps={{ sx: { fontSize: 13 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
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
                    InputProps={{ sx: { height: 48, fontSize: 14 } }}
                    InputLabelProps={{ sx: { fontSize: 13 } }}
                  />
                </Grid>
              </Grid>
  
              <Box
                mb={3}
                p={2}
                bgcolor="#fafafa"
                border="1px solid"
                borderColor="#ddd"
                borderRadius={2}
                fontSize={13}
              >
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
                    <Link component={RouterLink} to="/terms" underline="hover">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link component={RouterLink} to="/privacy" underline="hover">
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
                sx={{
                  mt: 3,
                  height: 48,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: 15,
                  backgroundColor: "#1a1a1d",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
                disabled={meta.submitting}
              >
                {meta.submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
  
};

export default Onboard;
