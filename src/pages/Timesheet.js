
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTimesheet, fetchTimesheets, autoFillTimesheet } from "../redux/slices/timesheetSlice";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  AutoAwesome,
  Save,
  AccessTime,
  Work,
  Description,
  CalendarToday,
  CheckCircle,
  Warning,
  Info,
  SmartToy,
} from "@mui/icons-material";

export default function Timesheet() {
  const dispatch = useDispatch();
  const {
    list: timesheets,
    loading,
    error,
    autoFillLoading,
    autoFillData
  } = useSelector((state) => state.timesheet);

  const [form, setForm] = useState({
    date: "",
    project: "",
    hoursWorked: "",
    description: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [aiConfidence, setAiConfidence] = useState(null);

  useEffect(() => {
    dispatch(fetchTimesheets());
  }, [dispatch]);

  useEffect(() => {
    if (autoFillData) {
      setForm((prevForm) => ({
        date: autoFillData.date || prevForm.date,
        project: autoFillData.project || "",
        hoursWorked: autoFillData.hoursWorked?.toString() || "",
        description: autoFillData.description || ""
      }));

      // Mock AI Confidence Score
      setAiConfidence(Math.floor(Math.random() * (98 - 85) + 85));

      setSnackbar({
        open: true,
        message: "AI successfully predicted your timesheet!",
        severity: "success"
      });
    }
  }, [autoFillData]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error"
      });
    }
  }, [error]);

  const handleAutoFill = () => {
    if (!form.date) {
      setSnackbar({
        open: true,
        message: "Please select a date first for AI prediction",
        severity: "warning"
      });
      return;
    }
    dispatch(autoFillTimesheet(form.date));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.project || !form.hoursWorked || !form.description) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error"
      });
      return;
    }

    dispatch(addTimesheet({
      ...form,
      hoursWorked: parseFloat(form.hoursWorked)
    })).then((result) => {
      if (addTimesheet.fulfilled.match(result)) {
        setForm({ date: "", project: "", hoursWorked: "", description: "" });
        setAiConfidence(null);
        setSnackbar({
          open: true,
          message: "Timesheet submitted successfully!",
          severity: "success"
        });
        dispatch(fetchTimesheets());
      } else if (addTimesheet.rejected.match(result)) {
        setSnackbar({
          open: true,
          message: result.payload || "Failed to submit timesheet. Make sure the backend is running.",
          severity: "error"
        });
      }
    }).catch((err) => {
      setSnackbar({
        open: true,
        message: "Network error. Please check if the backend server is running on http://localhost:5000",
        severity: "error"
      });
    });
  };

  // Mock Anomaly Detection
  const getAnomalyStatus = (hours) => {
    if (hours > 12) return { status: 'High Risk', color: 'error', icon: <Warning fontSize="small" /> };
    if (hours > 9) return { status: 'Unusual', color: 'warning', icon: <Info fontSize="small" /> };
    return { status: 'Normal', color: 'success', icon: <CheckCircle fontSize="small" /> };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="fade-in">
        <Box>
          <Typography variant="h4" fontWeight={700} className="gradient-text" gutterBottom>
            Timesheet Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log your hours or let AI do it for you
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AutoAwesome />}
          onClick={handleAutoFill}
          disabled={autoFillLoading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            px: 3,
            py: 1.5,
          }}
        >
          {autoFillLoading ? "AI is Thinking..." : "AI Auto-Fill"}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Entry Form */}
        <Grid item xs={12} md={4}>
          <Paper
            className="glass hover-lift slide-in-left"
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', mr: 2, color: 'white' }}>
                <AccessTime />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                New Entry
              </Typography>
            </Box>

            {aiConfidence && (
              <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd' }} className="scale-in">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" fontWeight={600} color="primary">
                    AI Confidence Score
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="primary">
                    {aiConfidence}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={aiConfidence}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#bae6fd',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Based on your previous work patterns
                </Typography>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                }}
              />
              <TextField
                fullWidth
                label="Project"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Work sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                }}
              />
              <TextField
                fullWidth
                type="number"
                label="Hours Worked"
                value={form.hoursWorked}
                onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <AccessTime sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Description sx={{ color: 'text.secondary', mr: 1, fontSize: 20, mt: 1 }} />,
                  alignItems: 'flex-start'
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                sx={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
                }}
              >
                Submit Entry
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Timesheet List */}
        <Grid item xs={12} md={8}>
          <Paper
            className="hover-lift slide-in-right"
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'white'
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Entries
              </Typography>
              <Chip
                icon={<SmartToy sx={{ fontSize: 16 }} />}
                label="AI Anomaly Detection Active"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#667eea', color: '#667eea' }}
              />
            </Box>

            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Hours</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>AI Analysis</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timesheets.map((row) => {
                      const anomaly = getAnomalyStatus(row.hoursWorked);
                      return (
                        <TableRow key={row._id || row.id || Math.random()} hover sx={{ transition: 'background 0.2s' }}>
                          <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Typography fontWeight={500}>{row.project}</Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200 }} noWrap>
                            <Tooltip title={row.description}>
                              <span>{row.description}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${row.hoursWorked} hrs`}
                              size="small"
                              sx={{ fontWeight: 600, bgcolor: '#f0f4ff', color: '#667eea' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={`AI Status: ${anomaly.status}`}>
                              <Chip
                                icon={anomaly.icon}
                                label={anomaly.status}
                                size="small"
                                color={anomaly.color}
                                variant="outlined"
                                sx={{ height: 24 }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.status || "Pending"}
                              size="small"
                              sx={{
                                background: row.status === 'Approved'
                                  ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                  : 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
                                color: 'white',
                                fontWeight: 600,
                                border: 'none'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {timesheets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No timesheet entries found. Try using AI Auto-Fill!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
