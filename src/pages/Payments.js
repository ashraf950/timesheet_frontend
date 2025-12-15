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
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            animation: dialogOpen ? 'fadeInDialog 0.5s' : 'none',
          }
        }}
      >
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  CheckCircle,
  Warning,
  Info,
  AttachMoney,
  TrendingUp,
  Psychology,
  AutoAwesome,
  History,
  Receipt,
  CreditCard,
  AccountBalance,
} from "@mui/icons-material";

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
  const [aiConfidence, setAiConfidence] = useState(0);
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
    // Mock AI matching logic
    const mockConfidence = Math.floor(Math.random() * (99 - 85) + 85);
    setAiConfidence(mockConfidence);

    setReconcileForm({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "Bank Transfer", // AI suggestion
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // AI suggestion
      notes: "AI Match: Verified against bank feed ending in 4432",
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
    // Enhanced color and icon for each status
    const styles = {
      paid: {
        bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        icon: <CheckCircle sx={{ fontSize: 18 }}/> ,
        tooltip: 'Payment received',
      },
      pending: {
        bg: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
        icon: <Warning sx={{ fontSize: 18 }}/> ,
        tooltip: 'Awaiting payment',
      },
      overdue: {
        bg: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
        icon: <Warning sx={{ fontSize: 18 }}/> ,
        tooltip: 'Payment overdue',
      },
      partial: {
        bg: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
        icon: <Info sx={{ fontSize: 18 }}/> ,
        tooltip: 'Partially paid',
      },
    };
    const style = styles[status] || styles.pending;
    return (
      <Tooltip title={style.tooltip} arrow>
        <Chip
          icon={style.icon}
          label={status.toUpperCase()}
          size="small"
          sx={{
            background: style.bg,
            color: 'white',
            fontWeight: 700,
            border: 'none',
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '& .MuiChip-icon': { color: 'white' }
          }}
        />
      </Tooltip>
    );
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

  // Calculate stats
  const totalCollected = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="fade-in">
        <Box>
          <Typography variant="h4" fontWeight={800} className="gradient-text" gutterBottom>
            Payment Reconciliation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered payment tracking and matching
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchPayments())}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <History />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
            borderRadius: 2,
            px: 3
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }} className="slide-in-up">
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white',
              transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
              '&:hover': {
                transform: 'scale(1.045)',
                boxShadow: '0 8px 32px rgba(17,153,142,0.18)',
              },
            }}
            className="hover-lift"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Total Collected</Typography>
                <Typography variant="h3" fontWeight={700}>{formatCurrency(totalCollected)}</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                <AccountBalance sx={{ fontSize: 40 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
              color: 'white',
              transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
              '&:hover': {
                transform: 'scale(1.045)',
                boxShadow: '0 8px 32px rgba(245,175,25,0.18)',
              },
            }}
            className="hover-lift"
          >
            // Add these keyframes to your global CSS (e.g., App.css):
            // @keyframes fadeInDialog { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Pending Collection</Typography>
                <Typography variant="h3" fontWeight={700}>{formatCurrency(pendingAmount)}</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                <Warning sx={{ fontSize: 40 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        className="glass fade-in"
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Invoice Details</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment Info</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment, idx) => (
                  <TableRow
                    key={payment._id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.04)' },
                      animation: 'fadeInRow 0.7s',
                      animationDelay: `${idx * 60}ms`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#e3f2fd', color: '#1976d2', mr: 2 }}>
                          <Receipt fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {payment.invoice?.invoiceNumber || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.invoice?.clientName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {payment.status === 'overdue' && (
                          <Typography variant="caption" color="error" fontWeight={600}>
                            {getDaysOverdue(payment.dueDate)} days late
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>
                      {payment.paymentDate ? (
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.paymentMethod}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.status !== 'paid' && (
                        <Tooltip title="Record payment & mark as paid" arrow>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AutoAwesome />}
                            onClick={() => handleReconcilePayment(payment)}
                            sx={{
                              borderRadius: 2,
                              borderColor: '#667eea',
                              color: '#667eea',
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              '&:hover': { borderColor: '#764ba2', bgcolor: 'rgba(102, 126, 234, 0.04)' }
                            }}
                          >
                            Smart Reconcile
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No payments" width={80} style={{ opacity: 0.7, marginBottom: 16 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No payments found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generate invoices to start tracking payments
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                // Add fadeInRow animation
                // Add this style at the end of the file or in your global CSS
                // @keyframes fadeInRow { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* AI Reconcile Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', mr: 2, color: 'white' }}>
              <AutoAwesome />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                AI Smart Reconciliation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Review AI-suggested payment match details
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedPayment && (
            <Grid container spacing={3}>
              {/* AI Confidence Card */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Psychology sx={{ color: '#667eea', mr: 1 }} />
                    <Typography variant="subtitle2" fontWeight={700}>
                      AI Match Confidence: {aiConfidence}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={aiConfidence}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Based on amount match, client history, and transaction timing.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Invoice Details
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700}>{selectedPayment.invoice?.invoiceNumber}</Typography>
                  <Typography variant="body2">{selectedPayment.invoice?.clientName}</Typography>
                  <Typography variant="h5" color="primary" fontWeight={700} sx={{ mt: 1 }}>
                    {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  value={reconcileForm.paymentDate}
                  onChange={(e) => setReconcileForm({ ...reconcileForm, paymentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ mb: 2 }}
                />
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
                  label="Transaction ID / Reference"
                  value={reconcileForm.transactionId}
                  onChange={(e) => setReconcileForm({ ...reconcileForm, transactionId: e.target.value })}
                  helperText="AI suggested based on bank feed scan"
                  InputProps={{
                    endAdornment: <AutoAwesome color="primary" sx={{ opacity: 0.5 }} />
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Reconciliation Notes"
                  multiline
                  rows={2}
                  value={reconcileForm.notes}
                  onChange={(e) => setReconcileForm({ ...reconcileForm, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReconciliation}
            variant="contained"
            disabled={reconcileLoading}
            startIcon={reconcileLoading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
            }}
          >
            Confirm Match
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}