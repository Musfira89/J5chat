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
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.ico";
import api from "../../api";

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
      bgcolor="#f0f0f0"
      px={2}
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
            gap: 2,
          }}
        >
          {/* Logo */}
          <Avatar
            src={logo}
            alt="J5Chat Admin"
            sx={{
              width: 90,
              height: 90,
              mb: 1,
              mx: "auto",
            }}
          />

          {/* Headings */}
          <Typography variant="h5" fontWeight="bold">
            Enter Your Invite Link
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
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
              component="button"
              onClick={() => setOpen(true)}
              underline="always"
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ backdropFilter: "blur(8px)" }}
      >
        <Box
          sx={{
            width: "92%",
            maxWidth: 860,
            mx: "auto",
            mt: "8vh",
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            overflowY: "auto",
            maxHeight: "88vh",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Title */}
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            mb={1}
            textAlign="center"
          >
            Joining Instructions
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Follow the steps below to join the J5.Chat community.
          </Typography>

          {/* Section Content */}
          <Box display="flex" flexDirection="column" gap={4}>
            {/* STEP 1 */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Step 1: Paste Your Invite Link
              </Typography>
              <Typography color="text.secondary" fontSize="14.5px">
                Enter the link provided by the admin into the input field above.
                <br />
                <Typography
                  component="span"
                  fontStyle="italic"
                  fontSize="14px"
                  color="text.disabled"
                >
                  Example:
                  https://j5.chat/#/register?registration_token=J5-XXXXXX
                </Typography>
              </Typography>
            </Box>

            {/* STEP 2 */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Step 2: Register Your Account
              </Typography>
              <Typography color="text.secondary" fontSize="14.5px">
                After submitting the invite, you'll be redirected to the
                registration screen. Create your account with a username and a
                secure password. This step is mandatory.
              </Typography>
            </Box>
            {/* Security Notice */}
            <Box
              sx={{
                borderRadius: 2,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1f1f1f" : "#f8f9fa",
                px: 3,
                py: 2.5,
                border: (theme) =>
                  `1px solid ${
                    theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
                  }`,
              }}
            >
              <Typography fontWeight={600} fontSize={14} mb={0.5}>
                Important Notice
              </Typography>
              <Typography fontSize={14.2} color="text.secondary">
                Public signups are disabled. This invite link is your only
                opportunity to register. Please complete your account creation
                immediately.
              </Typography>
            </Box>

            {/* STEP 3 */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Step 3: Secure Messages with Key Backup
              </Typography>
              <Typography color="text.secondary" fontSize="14.5px">
                After registration, Element will prompt you with:
                <br />
                <Typography component="span" fontStyle="italic" fontSize="14px">
                  “You may lose access to your messages if you don’t back up
                  your encryption keys.”
                </Typography>
                <br />
                Choose <strong>Start using Key Backup</strong> and follow the
                instructions. You’ll receive a 12-word secret recovery phrase.
                Save the phrase securely. Do not share it.
              </Typography>
            </Box>

            {/* STEP 4 */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                Step 4: Sign In Later
              </Typography>
              <Typography color="text.secondary" fontSize="14.5px">
                Visit{" "}
                <Box component="span" fontWeight={500} color="primary.main">
                  https://j5.chat/#/login
                </Box>{" "}
                to log in anytime using your username and password.
                <br />
                If needed, enter your recovery phrase to restore messages.
              </Typography>
            </Box>
          </Box>

          {/* PDF Download Button */}
          <Box mt={5} textAlign="center">
            <Button
              component="a"
              href="/custom/Instructions.pdf"
              download
              target="_blank"
              rel="noopener"
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                fontSize: 14.5,
                backgroundColor: "#000",
                color: "#fff",
                px: 3.5,
                py: 1.2,
                "&:hover": {
                  backgroundColor: "#222",
                },
              }}
            >
              Download as PDF
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default InvitePage;
