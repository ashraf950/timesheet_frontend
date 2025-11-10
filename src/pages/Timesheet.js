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
} from "@mui/material";

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
      setSnackbar({
        open: true,
        message: "Timesheet auto-filled successfully!",
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
        setSnackbar({
          open: true,
          message: "Timesheet submitted successfully!",
          severity: "success"
        });
        // Refresh the timesheet list
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

  const handleAutoFill = () => {
    if (!form.date) {
      setSnackbar({
        open: true,
        message: "Please select a date first",
        severity: "error"
      });
      return;
    }
    dispatch(autoFillTimesheet(form.date));
  };

  const getStatusChip = (status) => {
    const colors = {
      pending: "warning",
      approved: "success",
      rejected: "error"
    };
    return <Chip label={status} color={colors[status] || "default"} size="small" />;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Timesheet Management
      </Typography>

      {/* Timesheet Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Submit Timesheet Entry
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Project"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Hours Worked"
                type="number"
                inputProps={{ step: 0.25, min: 0, max: 24 }}
                value={form.hoursWorked}
                onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'end' }}>
                <Button
                  variant="outlined"
                  onClick={handleAutoFill}
                  disabled={autoFillLoading || !form.date}
                  startIcon={autoFillLoading ? <CircularProgress size={20} /> : null}
                >
                  Auto-Fill
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Submit Timesheet
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Timesheets Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Timesheets
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet._id || timesheet.id || Math.random()}>
                    <TableCell>
                      {timesheet.date ? new Date(timesheet.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{timesheet.project || 'N/A'}</TableCell>
                    <TableCell>{timesheet.hoursWorked || 0} hrs</TableCell>
                    <TableCell>{timesheet.description || 'N/A'}</TableCell>
                    <TableCell>{getStatusChip(timesheet.status || 'pending')}</TableCell>
                    <TableCell>
                      {timesheet.createdAt ? new Date(timesheet.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                {timesheets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No timesheets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
