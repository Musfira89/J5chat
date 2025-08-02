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
import axios from "axios";
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
      const hashParams = new URLSearchParams(url.hash.replace("#/register?", ""));
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
    
      setToast({
        open: true,
        message: "Token accepted! Redirecting...",
        severity: "success",
      });
    
      setTimeout(() => {
        const url = new URL(inviteLink);
        const hashParams = new URLSearchParams(url.hash.replace("#/register?", ""));
        const token = hashParams.get("registration_token");
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
                color: "#b71c1c",
                fontWeight: 500,
                textDecorationColor: "#b71c1c", 
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

      {/* Instructions Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: 850,
            bgcolor: "#fff",
            borderRadius: 3,
            p: 4,
            mx: "auto",
            mt: 6,
            boxShadow: 24,
            fontFamily: "Inter, Roboto, sans-serif",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Close */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h5" fontWeight="bold" mb={2} color="text.primary">
        JOINING Instructions!
      </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Content */}
          <Box display="flex" flexDirection="column" gap={2} fontSize="0.95rem">
            <Typography>
              <strong>Step 1: Paste Your Invite Link</strong>
              <br />
              Paste the link shared by the admin into the box above.
              <br />
              Example:{" "}
              <i>https://j5.chat/#/register?registration_token=J5-XXXXXX</i>
            </Typography>

            <Typography>
              <strong>
                Step 2: You'll Be Redirected to the Registration Page
              </strong>
              <br />
              After the link is accepted, you’ll be taken into the app (Element
              Web or Mobile).
              <br />
              There, create your account with a username and secure password.
            </Typography>

            <Typography>
              🔒 <strong>Note:</strong> Public signups are disabled, so this is
              your only chance to register.
              <br />
              Make sure you complete your account creation right away.
            </Typography>

            <Typography>
              <strong>Step 3: Secure Your Messages with Key Backup</strong>
              <br />
              After registration, Element will ask:
              <br />
              <i>
                “You may lose access to your messages if you don’t back up your
                encryption keys.”
              </i>
              <br />
              Choose <strong>“Start using Key Backup”</strong> and follow the
              instructions.
              <br />
              You’ll receive a 12-word secret recovery phrase.
              <br />
              Save it securely (do not share it).
            </Typography>

            <Typography>
              <strong>Step 4: Next Time, Just Sign In</strong>
              <br />
              Go to 👉 <i>https://j5.chat/#/login</i>
              <br />
              Log in with your username and password.
              <br />
              If asked, enter your recovery phrase to restore messages.
            </Typography>
          </Box>

          {/* PDF Button */}
          <Box mt={4} textAlign="center">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              href="/instructions.pdf"
              download
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
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
