import React, { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.ico";
import api from "../../api";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/login", { password });      
      setToastOpen(true);
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } catch (err) {
      setError("Incorrect password");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Avatar
          src={logo}
          alt="J5Chat Admin"
          sx={{
            width: 90,
            height: 90,
            mb: 2,
            mx: "auto",
          }}
        />

        <Typography variant="h5" fontWeight="bold" mb={1}>
          J5Chat Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Authorized access only
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            type="password"
            label="Admin Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <LockIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
            Login
          </Button>
        </form>

        <Typography
          variant="caption"
          display="block"
          mt={4}
          color="text.disabled"
        >
          &copy; {new Date().getFullYear()} J5Chat Admin Token Portal
        </Typography>
      </Paper>

      {/* Toast for success */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
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
          Login successful
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;
