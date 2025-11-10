import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals, updateApproval } from "../redux/slices/approvalSlice";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const { pendingApprovals, loading, updateLoading, error, updateError } = useSelector(
    (state) => state.approval
  );

  const [selectedApproval, setSelectedApproval] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [actionType, setActionType] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  useEffect(() => {
    if (error || updateError) {
      setSnackbar({
        open: true,
        message: error || updateError,
        severity: "error"
      });
    }
  }, [error, updateError]);

  const handleApprovalAction = (approval, action) => {
    setSelectedApproval(approval);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedApproval) {
      dispatch(updateApproval({
        id: selectedApproval._id,
        status: actionType,
        comments: comments
      })).then((result) => {
        if (updateApproval.fulfilled.match(result)) {
          setSnackbar({
            open: true,
            message: `Timesheet ${actionType} successfully!`,
            severity: "success"
          });
          handleCloseDialog();
        }
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApproval(null);
    setComments("");
    setActionType("");
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
        Manager Dashboard
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pending Timesheet Approvals
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
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApprovals.map((approval) => (
                  <TableRow key={approval._id}>
                    <TableCell>{approval.user?.name || approval.user?.email}</TableCell>
                    <TableCell>{new Date(approval.date).toLocaleDateString()}</TableCell>
                    <TableCell>{approval.project}</TableCell>
                    <TableCell>{approval.hoursWorked} hrs</TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {approval.description}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(approval.status)}</TableCell>
                    <TableCell>
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprovalAction(approval, "approved")}
                          disabled={updateLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleApprovalAction(approval, "rejected")}
                          disabled={updateLoading}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingApprovals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No pending approvals found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {actionType === "approved" ? "Approve" : "Reject"} Timesheet
        </DialogTitle>
        <DialogContent>
          {selectedApproval && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Timesheet Details:
              </Typography>
              <Typography variant="body2">
                Employee: {selectedApproval.user?.name || selectedApproval.user?.email}
              </Typography>
              <Typography variant="body2">
                Date: {new Date(selectedApproval.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Project: {selectedApproval.project}
              </Typography>
              <Typography variant="body2">
                Hours: {selectedApproval.hoursWorked}
              </Typography>
              <Typography variant="body2">
                Description: {selectedApproval.description}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Comments (Optional)"
            multiline
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments about this approval/rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={actionType === "approved" ? "success" : "error"}
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={20} /> : null}
          >
            {actionType === "approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

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