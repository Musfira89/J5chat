import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  useMediaQuery,
  IconButton,
  Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ContentCopy, Delete, Search } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import api from "../../api";
import { Logout } from "@mui/icons-material";


const TokenManagement = () => {
  const [tokens, set_tokens] = useState([]);
  const [deleting_token, set_deleting_token] = useState(null);
  const [open, set_open] = useState(false);
  const [detail_modal, set_detail_modal] = useState(null);
  const [tab, set_tab] = useState("All");
  const [search, set_search] = useState("");
  const [usage_limit, set_usage_limit] = useState(100);
  const [dark_mode, set_dark_mode] = useState(false);

  const theme = useTheme();
  const is_mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const mui_theme = createTheme({
    palette: {
      mode: dark_mode ? "dark" : "light",
    },
  });

  const fetch_tokens = async () => {
    const res = await api.get("/admin/tokens");
    set_tokens(res.data);
  };

  const generate_time_token = async () => {
    try {
      await api.post("/admin/generate", { count: 1, mode: "time" });
      fetch_tokens();
      toast.dark("1 time-based token generated");
    } catch {
      toast.error("Failed to generate token");
    }
  };

  const generate_usage_token = async () => {
    try {
      await api.post("/admin/generate", {
        count: 1,
        mode: "usage",
        usage_limit,
      });
      fetch_tokens();
      toast.dark("1 usage-based shared token generated");
    } catch {
      toast.error("Failed to generate token");
    }
  };

  const confirm_delete = (token) => {
    set_deleting_token(token);
    set_open(true);
  };

  const delete_confirmed = async () => {
    await api.delete(`/admin/tokens/${deleting_token.token}`);
    set_open(false);
    set_deleting_token(null);
    fetch_tokens();
    toast.dark("Token deleted successfully");
  };

  const copy = (token) => {
    const full_link = `https://j5.chat/#/register?registration_token=${token}`;
    navigator.clipboard.writeText(full_link);
    toast.dark("Invite link copied to clipboard");
  };

  const handle_view_details = async (token_string) => {
    const res = await api.get("/admin/tokens");
    const updated = res.data.find((t) => t.token === token_string);
    set_detail_modal(updated);
  };

  const handle_logout = () => {
    window.location.href = "https://j5.chat/custom/#/adminLogin";
  };

  useEffect(() => {
    fetch_tokens();
  }, []);

  const filtered_tokens = tokens.filter((token) => {
    const now = new Date();
    const is_expired = token.expires_at && new Date(token.expires_at) < now;
    const is_used = !!token.used_at;

    let status = "Unused";
    if (is_expired) status = "Expired";
    else if (is_used) status = "Used";

    if (tab !== "All" && status !== tab) return false;
    return token.token.toLowerCase().includes(search.toLowerCase());
  });

  const time_based_tokens = filtered_tokens.filter((t) => t.mode === "time");
  const shared_tokens = filtered_tokens.filter((t) => t.mode === "usage");

  return (
    <ThemeProvider theme={mui_theme}>
      <Box sx={{ p: 4, backgroundColor: "background.default", color: "text.primary", minHeight: "100vh" }}>
        <ToastContainer theme={dark_mode ? "dark" : "light"} />

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>API Tokens</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => set_dark_mode(!dark_mode)}>
              {dark_mode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Tooltip title="Logout">
              <IconButton onClick={handle_logout} color="error">
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={tab} onChange={(e, new_val) => set_tab(new_val)} sx={{ mb: 3 }} variant="scrollable">
          {["All", "Used", "Unused", "Expired"].map((label) => (
            <Tab key={label} value={label} label={label} />
          ))}
        </Tabs>

        {/* Actions */}
        <Box display="flex" flexDirection={is_mobile ? "column" : "row"} gap={2} mb={8} flexWrap="wrap">
          <TextField
            placeholder="Search by token..."
            value={search}
            onChange={(e) => set_search(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={generate_time_token}>Generate 1 Token</Button>
          <TextField
            label="Usage Limit"
            type="number"
            value={usage_limit}
            onChange={(e) => set_usage_limit(Number(e.target.value))}
            sx={{ maxWidth: 160 }}
          />
          <Button variant="outlined" color="primary" onClick={generate_usage_token}>Generate Shared Token</Button>
        </Box>

        {/* Time-Based Tokens */}
        <Typography variant="h6" fontWeight={600} mb={1}>Time-Based (Single Use) Tokens</Typography>
        <TableContainer component={Paper} sx={{ mb: 5 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Used At</TableCell>
                <TableCell>IP</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {time_based_tokens.map((token) => (
                <TableRow key={token.token} hover>
                  <TableCell>{token.token}</TableCell>
                  <TableCell>{token.created_at?.split("T")[0]}</TableCell>
                  <TableCell>{token.email || "-"}</TableCell>
                  <TableCell>{token.used_at ? token.used_at.split("T")[0] : "-"}</TableCell>
                  <TableCell>{token.used_by_ip || "-"}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => copy(token.token)} variant="outlined" sx={{ mr: 1 }}>
                      <ContentCopy sx={{ fontSize: 16, mr: 0.5 }} /> Copy
                    </Button>
                    <Button size="small" onClick={() => confirm_delete(token)} variant="contained" color="error">
                      <Delete sx={{ fontSize: 16, mr: 0.5 }} /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Shared Tokens */}
        <Typography variant="h6" fontWeight={600} mb={1}>Shared (Usage-Based) Tokens</Typography>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shared_tokens.map((token) => (
                <TableRow key={token.token} hover>
                  <TableCell>{token.token}</TableCell>
                  <TableCell>{token.created_at?.split("T")[0]}</TableCell>
                  <TableCell>{token.usage_count || 0} / {token.usage_limit}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text" onClick={() => handle_view_details(token.token)} sx={{ mr: 1 }}>
                      View
                    </Button>
                    <Button size="small" onClick={() => copy(token.token)} variant="outlined" sx={{ mr: 1 }}>
                      <ContentCopy sx={{ fontSize: 16, mr: 0.5 }} /> Copy
                    </Button>
                    <Button size="small" onClick={() => confirm_delete(token)} variant="contained" color="error">
                      <Delete sx={{ fontSize: 16, mr: 0.5 }} /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Modal */}
        <Modal open={open} onClose={() => set_open(false)} sx={{ backdropFilter: "blur(6px)" }}>
          <Box sx={{
            p: 4, backgroundColor: theme.palette.background.paper, borderRadius: 3,
            boxShadow: 24, maxWidth: 400, mx: "auto", mt: "15vh", color: theme.palette.text.primary,
          }}>
            <Typography variant="h6" fontWeight={600} mb={1}>Confirm Deletion</Typography>
            <Typography variant="body2" mb={3}>
              Are you sure you want to delete the token: <strong>{deleting_token?.token}</strong>?
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => set_open(false)} variant="outlined">Cancel</Button>
              <Button onClick={delete_confirmed} variant="contained" color="error">Delete</Button>
            </Box>
          </Box>
        </Modal>

        {/* View Modal */}
        <Modal open={!!detail_modal} onClose={() => set_detail_modal(null)} sx={{ backdropFilter: "blur(6px)" }}>
          <Box sx={{
            p: 5, backgroundColor: "#1e1e1e", borderRadius: 3, boxShadow: 24,
            maxWidth: 700, mx: "auto", mt: "8vh", color: "#fff",
          }}>
            <Typography variant="h5" fontWeight="600" mb={3}>
              Usage Log:{" "}
              <Box component="span" fontWeight={500} color="primary.main">
                {detail_modal?.token}
              </Box>
            </Typography>

            <Typography mb={2}>Usage Count: {detail_modal?.usage_count || 0}</Typography>

            {detail_modal?.used_emails?.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2">Used Emails:</Typography>
                <ul>
                  {detail_modal.used_emails.map((email, i) => (
                    <li key={i}>{email}</li>
                  ))}
                </ul>
              </Box>
            )}

            {detail_modal?.usage_logs?.length ? (
              <Table size="small" sx={{ border: "1px solid #444", borderRadius: 2, overflow: "hidden", backgroundColor: "#2b2b2b" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#333" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Used At</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detail_modal.usage_logs.map((log, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: "#ccc" }}>{log.email || "-"}</TableCell>
                      <TableCell sx={{ color: "#ccc" }}>{log.used_at?.split("T")[0]}</TableCell>
                      <TableCell sx={{ color: "#ccc" }}>{log.used_by_ip || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography color="#aaa" mt={2}>No usage data found.</Typography>
            )}

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button onClick={() => set_detail_modal(null)} variant="outlined" sx={{
                borderRadius: 2, px: 4, fontWeight: "bold", color: "#fff", borderColor: "#555"
              }}>Close</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default TokenManagement;