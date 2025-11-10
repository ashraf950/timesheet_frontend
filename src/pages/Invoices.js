import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices, generateInvoice } from "../redux/slices/invoiceSlice";
import API from "../services/api";
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
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";

export default function Invoices() {
  const dispatch = useDispatch();
  const { invoices, loading, generateLoading, error, generateError } = useSelector(
    (state) => state.invoice
  );
  const { user } = useSelector((state) => state.auth);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [users, setUsers] = useState([]);
  const [manualUserId, setManualUserId] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    userId: "",
    clientName: "",
    clientEmail: "",
    startDate: "",
    endDate: "",
    hourlyRate: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: "Bank Transfer",
    transactionId: "",
    notes: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchInvoices());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      // Try the dedicated users endpoint first (if backend implements it)
      try {
        const response = await API.get("/auth/users");
        if (response.data.success) {
          setUsers(response.data.data || []);
          console.log(`Loaded ${response.data.count} users successfully from /auth/users`);
          return;
        }
      } catch (err) {
        console.log("Users endpoint not available, trying alternative methods...");
      }

      // Alternative: Get all invoices which should have populated user data
      try {
        const invoiceResponse = await API.get("/invoice");
        const invoices = invoiceResponse.data.data?.invoices || invoiceResponse.data.invoices || invoiceResponse.data || [];
        
        const uniqueUsersMap = new Map();
        
        invoices.forEach(invoice => {
          const userObj = invoice.userId;
          if (userObj && typeof userObj === 'object') {
            const userId = userObj._id || userObj.id;
            if (userId && !uniqueUsersMap.has(userId)) {
              uniqueUsersMap.set(userId, {
                _id: userId,
                id: userId,
                name: userObj.name || "Unknown User",
                email: userObj.email || "",
                role: userObj.role || "Employee",
                department: userObj.department || "",
                hourlyRate: userObj.hourlyRate || 0
              });
            }
          }
        });
        
        const usersFromInvoices = Array.from(uniqueUsersMap.values());
        
        if (usersFromInvoices.length > 0) {
          setUsers(usersFromInvoices);
          console.log(`Loaded ${usersFromInvoices.length} users from invoices`);
          return;
        }
      } catch (invoiceErr) {
        console.log("Could not extract users from invoices");
      }

      // Last resort: Request timesheets with populate to get all users
      try {
        // Try to get all timesheets (might require admin permissions)
        const timesheetResponse = await API.get("/timesheet?populate=userId");
        const timesheets = timesheetResponse.data.data?.timesheets || timesheetResponse.data.timesheets || timesheetResponse.data || [];
        
        const uniqueUsersMap = new Map();
        
        timesheets.forEach(ts => {
          const userObj = ts.userId;
          if (userObj && typeof userObj === 'object') {
            const userId = userObj._id || userObj.id;
            if (userId && !uniqueUsersMap.has(userId)) {
              uniqueUsersMap.set(userId, {
                _id: userId,
                id: userId,
                name: userObj.name || "Unknown User",
                email: userObj.email || "",
                role: userObj.role || "Employee",
                department: userObj.department || "",
                hourlyRate: userObj.hourlyRate || 0
              });
            }
          }
        });
        
        const usersFromTimesheets = Array.from(uniqueUsersMap.values());
        
        if (usersFromTimesheets.length > 0) {
          setUsers(usersFromTimesheets);
          console.log(`Loaded ${usersFromTimesheets.length} users from timesheets`);
          return;
        }
      } catch (timesheetErr) {
        console.log("Could not extract users from timesheets");
      }

      // If all methods fail, show error
      setSnackbar({
        open: true,
        message: "Unable to load users. Please ask your backend developer to implement the /api/auth/users endpoint.",
        severity: "warning"
      });
      setUsers([]);
      
    } catch (error) {
      console.error("Error fetching users:", error);
      
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: "Access denied. You need Admin, Manager, or Finance role to generate invoices.",
          severity: "error"
        });
      } else if (error.response?.status === 401) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "warning"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Unable to load users. Please ensure backend endpoint /api/auth/users is implemented.",
          severity: "warning"
        });
      }
      setUsers([]);
    }
  };

  useEffect(() => {
    if (error || generateError) {
      setSnackbar({
        open: true,
        message: error || generateError,
        severity: "error"
      });
    }
  }, [error, generateError]);

  const handleGenerateInvoice = () => {
    setDialogOpen(true);
  };

  const handleSubmitInvoice = () => {
    if (!invoiceForm.userId || !invoiceForm.clientName || !invoiceForm.startDate || !invoiceForm.endDate || !invoiceForm.hourlyRate) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
      return;
    }

    // Map frontend field names to backend expected names
    dispatch(generateInvoice({
      userId: invoiceForm.userId, // Use selected employee's userId
      clientName: invoiceForm.clientName,
      clientEmail: invoiceForm.clientEmail,
      periodStart: invoiceForm.startDate, // Backend expects periodStart
      periodEnd: invoiceForm.endDate,     // Backend expects periodEnd
      hourlyRate: parseFloat(invoiceForm.hourlyRate)
    })).then((result) => {
      if (generateInvoice.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message: "Invoice generated successfully!",
          severity: "success"
        });
        handleCloseDialog();
        // Refresh invoice list
        dispatch(fetchInvoices());
      } else if (generateInvoice.rejected.match(result)) {
        setSnackbar({
          open: true,
          message: result.payload || "Failed to generate invoice",
          severity: "error"
        });
      }
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setInvoiceForm({
      userId: "",
      clientName: "",
      clientEmail: "",
      startDate: "",
      endDate: "",
      hourlyRate: "",
    });
  };

  const handleRecordPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "Bank Transfer",
      transactionId: "",
      notes: "",
    });
    setPaymentDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentForm.paymentDate || !paymentForm.paymentMethod) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error"
      });
      return;
    }

    try {
      const response = await API.post("/payment", {
        invoiceId: selectedInvoice._id,
        amount: selectedInvoice.amount,
        paymentDate: paymentForm.paymentDate,
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
      });

      setSnackbar({
        open: true,
        message: "Payment recorded successfully!",
        severity: "success"
      });
      
      setPaymentDialogOpen(false);
      dispatch(fetchInvoices()); // Refresh invoices
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to record payment",
        severity: "error"
      });
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedInvoice(null);
  };

  const getStatusChip = (status) => {
    const colors = {
      draft: "default",
      sent: "info",
      paid: "success",
      overdue: "error",
      pending: "warning"
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Invoices
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerateInvoice}
            disabled={generateLoading}
            startIcon={generateLoading ? <CircularProgress size={20} /> : null}
          >
            Generate Invoice
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
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Hourly Rate</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {invoice.clientName || invoice.userId?.name || 'N/A'}
                        </Typography>
                        {(invoice.clientEmail || invoice.userId?.email) && (
                          <Typography variant="caption" color="textSecondary">
                            {invoice.clientEmail || invoice.userId?.email}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{invoice.totalHours} hrs</TableCell>
                    <TableCell>{formatCurrency(invoice.hourlyRate)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(invoice.amount || invoice.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                    <TableCell>
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {invoice.status === 'Draft' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleRecordPayment(invoice)}
                        >
                          Record Payment
                        </Button>
                      )}
                      {invoice.status === 'Paid' && (
                        <Chip label="Paid" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Generate Invoice Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Generate New Invoice
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Generate an invoice based on approved timesheets within the date range.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Select Employee"
                value={invoiceForm.userId}
                onChange={(e) => {
                  const selectedUser = users.find(u => (u._id || u.id) === e.target.value);
                  setInvoiceForm({ 
                    ...invoiceForm, 
                    userId: e.target.value,
                    // Auto-fill hourly rate if available
                    hourlyRate: selectedUser?.hourlyRate || invoiceForm.hourlyRate
                  });
                }}
                required
                helperText="Choose the employee whose timesheets should be invoiced"
                disabled={users.length === 0}
              >
                <MenuItem value="">
                  <em>{users.length === 0 ? "Loading users..." : "Select an employee"}</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id || user.id} value={user._id || user.id}>
                    {user.name} - {user.email} ({user.role}
                    {user.department ? `, ${user.department}` : ''}
                    {user.hourlyRate ? `, $${user.hourlyRate}/hr` : ''})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={invoiceForm.clientName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Email"
                type="email"
                value={invoiceForm.clientEmail}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={invoiceForm.startDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={invoiceForm.endDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hourly Rate ($)"
                type="number"
                inputProps={{ step: 0.01, min: 0 }}
                value={invoiceForm.hourlyRate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, hourlyRate: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={generateLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitInvoice}
            variant="contained"
            disabled={generateLoading}
            startIcon={generateLoading ? <CircularProgress size={20} /> : null}
          >
            Generate Invoice
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Record Payment
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Recording payment for <strong>{selectedInvoice.invoiceNumber}</strong>
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Amount:</strong> ${selectedInvoice.amount?.toFixed(2)}</Typography>
                <Typography variant="body2"><strong>Client:</strong> {selectedInvoice.clientName || selectedInvoice.userId?.name}</Typography>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    required
                  >
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Check">Check</MenuItem>
                    <MenuItem value="PayPal">PayPal</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Transaction ID (Optional)"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPayment}
            variant="contained"
            color="success"
          >
            Record Payment
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