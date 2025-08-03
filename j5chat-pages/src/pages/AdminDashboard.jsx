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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ContentCopy, Delete, Search } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import api from "../../api";


const TokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [deletingToken, setDeletingToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [usageLimit, setUsageLimit] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const fetchTokens = async () => {
    const res = await api.get("/admin/tokens");
    setTokens(res.data);
  };

  const generateTimeToken = async () => {
    try {
      await api.post("/admin/generate", { count: 1, mode: "time" });

      fetchTokens();
      toast.dark("1 time-based token generated");
    } catch {
      toast.error("Failed to generate token");
    }
  };

  const generateUsageToken = async () => {
    try {
      await api.post("/admin/generate", {        
        count: 1,
        mode: "usage",
        usageLimit,
      });
      fetchTokens();
      toast.dark("1 usage-based shared token generated");
    } catch {
      toast.error("Failed to generate token");
    }
  };

  const confirmDelete = (token) => {
    setDeletingToken(token);
    setOpen(true);
  };

  const deleteConfirmed = async () => {
    await api.delete(`/admin/tokens/${deletingToken.token}`
    );
    setOpen(false);
    setDeletingToken(null);
    fetchTokens();
    toast.dark("Token deleted successfully");
  };

  const copy = (token) => {
    const fullLink = `https://j5.chat/#/register?registration_token=${token}`;
    navigator.clipboard.writeText(fullLink);
    toast.dark("Invite link copied to clipboard");
  };

  const handleViewDetails = async (tokenString) => {
    const res = await api.get("/admin/tokens");
    const updated = res.data.find((t) => t.token === tokenString);
    setDetailModal(updated);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const filteredTokens = tokens.filter((token) => {
    const now = new Date();
    const isExpired = token.expiresAt && new Date(token.expiresAt) < now;
    const isUsed = !!token.usedAt;

    let status = "Unused";
    if (isExpired) status = "Expired";
    else if (isUsed) status = "Used";

    if (tab !== "All" && status !== tab) return false;
    return token.token.toLowerCase().includes(search.toLowerCase());
  });

  const timeBasedTokens = filteredTokens.filter((t) => t.mode === "time");
  const sharedTokens = filteredTokens.filter((t) => t.mode === "usage");
  

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
        <ToastContainer theme={darkMode ? "dark" : "light"} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600}>
            API Tokens
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          sx={{ mb: 3 }}
          variant="scrollable"
        >
          {["All", "Used", "Unused", "Expired"].map((label) => (
            <Tab key={label} value={label} label={label} />
          ))}
        </Tabs>

        {/* Actions */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          mb={8}
          flexWrap="wrap"
        >
          <TextField
            placeholder="Search by token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateTimeToken}
          >
            Generate 1 Token
          </Button>
          <TextField
            label="Usage Limit"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(Number(e.target.value))}
            sx={{ maxWidth: 160 }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={generateUsageToken}
          >
            Generate Shared Token
          </Button>
        </Box>

        {/* Time-Based Tokens Table */}
        <Typography variant="h6" fontWeight={600} mb={1}>
          Time-Based (Single Use) Tokens
        </Typography>
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
              {timeBasedTokens.map((token) => (
                <TableRow key={token.token} hover>
                  <TableCell>{token.token}</TableCell>
                  <TableCell>{token.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>{token.email || "-"}</TableCell>
                  <TableCell>
                    {token.usedAt ? token.usedAt.split("T")[0] : "-"}
                  </TableCell>
                  <TableCell>{token.usedByIP || "-"}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => copy(token.token)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      <ContentCopy sx={{ fontSize: 16, mr: 0.5 }} /> Copy
                    </Button>
                    <Button
                      size="small"
                      onClick={() => confirmDelete(token)}
                      variant="contained"
                      color="error"
                    >
                      <Delete sx={{ fontSize: 16, mr: 0.5 }} /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Shared Tokens Table */}
        <Typography variant="h6" fontWeight={600} mb={1}>
          Shared (Usage-Based) Tokens
        </Typography>
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
              {sharedTokens.map((token) => (
                <TableRow key={token.token} hover>
                  <TableCell>{token.token}</TableCell>
                  <TableCell>{token.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>
                    {token.usageCount || 0} / {token.usageLimit}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleViewDetails(token.token)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      onClick={() => copy(token.token)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      <ContentCopy sx={{ fontSize: 16, mr: 0.5 }} /> Copy
                    </Button>
                    <Button
                      size="small"
                      onClick={() => confirmDelete(token)}
                      variant="contained"
                      color="error"
                    >
                      <Delete sx={{ fontSize: 16, mr: 0.5 }} /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Modal */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{ backdropFilter: "blur(6px)" }}
        >
          <Box
            sx={{
              p: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 24,
              maxWidth: 400,
              mx: "auto",
              mt: "15vh",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={1}>
              Confirm Deletion
            </Typography>
            <Typography variant="body2" mb={3}>
              Are you sure you want to delete the token:{" "}
              <strong>{deletingToken?.token}</strong>?
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={deleteConfirmed}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Details Modal */}
        <Modal open={!!detailModal} onClose={() => setDetailModal(null)} sx={{ backdropFilter: "blur(6px)" }}>
  <Box
    sx={{
      p: 5,
      backgroundColor: "#1e1e1e",
      borderRadius: 3,
      boxShadow: 24,
      maxWidth: 700,
      mx: "auto",
      mt: "8vh",
      color: "#fff",
    }}
  >
    <Typography variant="h5" fontWeight="600" mb={3}>
      Usage Log:{" "}
      <Box component="span" fontWeight={500} color="primary.main">
        {detailModal?.token}
      </Box>
    </Typography>

    {detailModal?.usageLogs?.length ? (
      <Table
        size="small"
        sx={{
          border: "1px solid #444",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#2b2b2b",
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#333" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Used At</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>IP Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {detailModal.usageLogs.map((log, i) => (
            <TableRow key={i}>
              <TableCell sx={{ color: "#ccc" }}>{log.email || "-"}</TableCell>
              <TableCell sx={{ color: "#ccc" }}>{log.usedAt?.split("T")[0]}</TableCell>
              <TableCell sx={{ color: "#ccc" }}>{log.usedByIP || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <Typography color="#aaa" mt={2}>
        No usage data found.
      </Typography>
    )}

    <Box display="flex" justifyContent="flex-end" mt={4}>
      <Button
        onClick={() => setDetailModal(null)}
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 4,
          fontWeight: "bold",
          color: "#fff",
          borderColor: "#555",
        }}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>

      </Box>
    </ThemeProvider>
  );
};

export default TokenManagement;
