import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, reconcilePayment } from "../redux/slices/paymentSlice";
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
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

export default function Payments() {
  const dispatch = useDispatch();
  const { payments, loading, reconcileLoading, error, reconcileError } = useSelector(
    (state) => state.payment
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [reconcileForm, setReconcileForm] = useState({
    paymentDate: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  useEffect(() => {
    if (error || reconcileError) {
      setSnackbar({
        open: true,
        message: error || reconcileError,
        severity: "error"
      });
    }
  }, [error, reconcileError]);

  const handleReconcilePayment = (payment) => {
    setSelectedPayment(payment);
    setReconcileForm({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      transactionId: "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleSubmitReconciliation = () => {
    if (!reconcileForm.paymentDate || !reconcileForm.paymentMethod) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
      return;
    }

    dispatch(reconcilePayment({
      paymentId: selectedPayment._id,
      ...reconcileForm
    })).then((result) => {
      if (reconcilePayment.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message: "Payment reconciled successfully!",
          severity: "success"
        });
        handleCloseDialog();
      }
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPayment(null);
    setReconcileForm({
      paymentDate: "",
      paymentMethod: "",
      transactionId: "",
      notes: "",
    });
  };

  const getStatusChip = (status) => {
    const colors = {
      paid: "success",
      pending: "warning",
      overdue: "error",
      partial: "info"
    };
    return <Chip label={status} color={colors[status] || "default"} size="small" />;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const paymentMethods = [
    'Bank Transfer',
    'Credit Card',
    'PayPal',
    'Check',
    'Cash',
    'Other'
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Payments
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(fetchPayments())}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Refresh
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Days Overdue</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.invoice?.invoiceNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {payment.invoice?.clientName || 'N/A'}
                        </Typography>
                        {payment.invoice?.clientEmail && (
                          <Typography variant="caption" color="textSecondary">
                            {payment.invoice?.clientEmail}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>
                      {payment.status === 'overdue' && payment.dueDate ? (
                        <Chip
                          label={`${getDaysOverdue(payment.dueDate)} days`}
                          color="error"
                          size="small"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{payment.paymentMethod || '-'}</TableCell>
                    <TableCell>
                      {payment.status !== 'paid' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleReconcilePayment(payment)}
                          disabled={reconcileLoading}
                        >
                          Reconcile
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Reconcile Payment Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Reconcile Payment
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Details:
              </Typography>
              <Typography variant="body2">
                Invoice: {selectedPayment.invoice?.invoiceNumber}
              </Typography>
              <Typography variant="body2">
                Client: {selectedPayment.invoice?.clientName}
              </Typography>
              <Typography variant="body2">
                Amount: {formatCurrency(selectedPayment.amount)}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={reconcileForm.paymentDate}
                onChange={(e) => setReconcileForm({ ...reconcileForm, paymentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={reconcileForm.paymentMethod}
                onChange={(e) => setReconcileForm({ ...reconcileForm, paymentMethod: e.target.value })}
                required
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={reconcileForm.transactionId}
                onChange={(e) => setReconcileForm({ ...reconcileForm, transactionId: e.target.value })}
                placeholder="Enter transaction or reference ID"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={reconcileForm.notes}
                onChange={(e) => setReconcileForm({ ...reconcileForm, notes: e.target.value })}
                placeholder="Additional notes about this payment..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={reconcileLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReconciliation}
            variant="contained"
            disabled={reconcileLoading}
            startIcon={reconcileLoading ? <CircularProgress size={20} /> : null}
          >
            Reconcile Payment
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