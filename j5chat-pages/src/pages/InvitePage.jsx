import React, { useState, useEffect } from "react";
import {
  Box,
  Link,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Alert,
  Avatar,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.ico";
import api from "../../api";
import { Link as RouterLink } from "react-router-dom";
import Bg from "../assets/Bg.png";

const InvitePage = () => {
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [ip, setIP] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullName = queryParams.get("name");
  const email = queryParams.get("email");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIP(data.ip))
      .catch(() => setIP("Unavailable"));
  }, []);

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!inviteLink) {
      setToast({
        open: true,
        message: "Please paste your invite link.",
        severity: "error",
      });
      return;
    }

    try {
      const url = new URL(inviteLink);
      const hashParams = new URLSearchParams(
        url.hash.replace("#/register?", "")
      );
      const token = hashParams.get("registration_token");

      if (!token) {
        setToast({
          open: true,
          message: "Token missing from link.",
          severity: "error",
        });
        return;
      }

      await api.post("/admin/use-token", {
        token,
        ip,
        fullName,
        email,
      });

      // ✅ Store token temporarily
      localStorage.setItem("registration_token", token);

      setToast({
        open: true,
        message: "Token accepted! Redirecting...",
        severity: "success",
      });

      setTimeout(() => {
        window.location.href = `https://j5.chat/#/register?registration_token=${token}`;
      }, 1200);
    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.message ||
        (err.response?.status === 404 && "Token not found") ||
        (err.response?.status === 410 && "Token expired") ||
        (err.response?.status === 403 && "Email mismatch") ||
        "Invalid or already used token.";

      setToast({
        open: true,
        message: msg,
        severity: "error",
      });
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      position="relative"
      overflow="hidden"
      sx={{
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
          backgroundColor: "rgba(0,0,0,0.5)", // black overlay
          zIndex: -1,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            backdropFilter: "blur(15px)",
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          {/* Logo */}
          <Avatar
            src={logo}
            alt="J5Chat Admin"
            sx={{
              width: 100,
              height: 100,
              mb: 1,
              mx: "auto",
              mt: 2,
            }}
          />

          {/* Headings */}
          <Typography variant="h5" fontWeight="bold">
            Enter Your Invite Link
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Paste the link you received to continue
          </Typography>

          {/* Form */}
          <form onSubmit={handleContinue} style={{ width: "100%" }}>
            <TextField
              fullWidth
              type="url"
              label="Invite Link"
              placeholder="https://j5.chat/#/register?registration_token=abc123"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#1a1a1d", // dark black/gray
                "&:hover": {
                  backgroundColor: "#000000", // pure black on hover
                },
              }}
            >
              Continue
            </Button>
          </form>

          {/* Read Instructions & IP aligned in same row */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Link
              component={RouterLink}
              to="/instructions"
              underline="hover"
              sx={{
                fontSize: "0.90rem",
                color: "#000",
                fontWeight: 500,
                textDecorationColor: "#000",
              }}
            >
              Read Instructions
            </Link>

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.85rem" }}
            >
              IP: {ip || "Loading..."}
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          sx={{
            width: "100%",
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 1,
            boxShadow: 3,
            alignItems: "center",
            svg: { color: "#fff" },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvitePage;
