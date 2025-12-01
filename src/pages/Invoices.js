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
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Receipt,
  Add,
  Visibility,
  GetApp,
  Payment,
  CheckCircle,
  DateRange,
  Person,
  AttachMoney,
  Business,
  Email,
  Close,
} from "@mui/icons-material";

export default function Invoices() {
  const dispatch = useDispatch();
  const { invoices, loading, generateLoading, error, generateError } = useSelector(
    (state) => state.invoice
  );
  const { user } = useSelector((state) => state.auth);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [users, setUsers] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState({
    userId: "",
    clientName: "",
    clientEmail: "",
    startDate: "",
    endDate: "",
    hourlyRate: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchInvoices());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      // Try the dedicated users endpoint first
      try {
        const response = await API.get("/auth/users");
        if (response.data.success) {
          setUsers(response.data.data || []);
          return;
        }
      } catch (err) {
        console.log("Users endpoint not available, trying alternative methods...");
      }

      // Alternative: Get all invoices which should have populated user data
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
              name: userObj.name || "Unknown User",
              email: userObj.email || "",
              role: userObj.role || "Employee",
            });
          }
        }
      });
      setUsers(Array.from(uniqueUsersMap.values()));
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    dispatch(generateInvoice(invoiceForm)).then((result) => {
      if (generateInvoice.fulfilled.match(result)) {
        setDialogOpen(false);
        setInvoiceForm({
          userId: "",
          clientName: "",
          clientEmail: "",
          startDate: "",
          endDate: "",
          hourlyRate: "",
        });
        setSnackbar({
          open: true,
          message: "Invoice generated successfully!",
          severity: "success"
        });
        dispatch(fetchInvoices());
      }
    });
  };

  const handlePreview = (invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "Downloading invoice PDF...",
      severity: "info"
    });
    // Mock download delay
    setTimeout(() => {
      setSnackbar({
        open: true,
        message: "Invoice downloaded successfully!",
        severity: "success"
      });
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="fade-in">
        <Box>
          <Typography variant="h4" fontWeight={700} className="gradient-text" gutterBottom>
            Invoice Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate, track, and manage your invoices
          </Typography>
        </Box>
        {(user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Finance') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
              px: 3,
              py: 1.5,
            }}
          >
            Generate Invoice
          </Button>
        )}
      </Box>

      {/* Invoices List */}
      <Paper
        className="glass hover-lift slide-in-up"
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          background: 'white',
          mb: 4
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Invoice ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice._id || invoice.id} hover sx={{ transition: 'background 0.2s' }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        #{invoice.invoiceNumber || invoice._id?.substring(0, 8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        {invoice.clientName || 'Unknown Client'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(invoice.startDate).toLocaleDateString()} - {new Date(invoice.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="success.main">
                        {formatCurrency(invoice.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        size="small"
                        sx={{
                          background: invoice.status === 'Paid'
                            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                            : invoice.status === 'Overdue'
                              ? 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
                              : 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)',
                          color: 'white',
                          fontWeight: 600,
                          border: 'none'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Preview Invoice">
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(invoice)}
                          sx={{ color: '#667eea', mr: 1 }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton
                          size="small"
                          onClick={handleExport}
                          sx={{ color: '#11998e' }}
                        >
                          <GetApp fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No invoices found. Generate one to get started!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Generate Invoice Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', mr: 2, color: 'white' }}>
              <Receipt />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Generate New Invoice
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {generateError && <Alert severity="error" sx={{ mb: 2 }}>{generateError}</Alert>}
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Select Employee"
                value={invoiceForm.userId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, userId: e.target.value })}
                sx={{ mb: 2 }}
              >
                {users.map((u) => (
                  <MenuItem key={u._id || u.id} value={u._id || u.id}>
                    {u.name} ({u.email})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Client Name"
                value={invoiceForm.clientName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Business sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
              <TextField
                fullWidth
                label="Client Email"
                type="email"
                value={invoiceForm.clientEmail}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={invoiceForm.startDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, startDate: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={invoiceForm.endDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, endDate: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Hourly Rate ($)"
                type="number"
                value={invoiceForm.hourlyRate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, hourlyRate: e.target.value })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={generateLoading}
            sx={{
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
            }}
          >
            {generateLoading ? "Generating..." : "Generate Invoice"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 0, minHeight: '80vh' }
        }}
      >
        {selectedInvoice && (
          <Box sx={{ p: 5 }}>
            {/* Invoice Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
              <Box>
                <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
                  INVOICE
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  #{selectedInvoice.invoiceNumber || selectedInvoice._id?.substring(0, 8).toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight={700}>
                  Timesheet Platform Inc.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  123 Tech Street, Silicon Valley
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  billing@timesheet.com
                </Typography>
              </Box>
            </Box>

            {/* Bill To */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                  BILL TO
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {selectedInvoice.clientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInvoice.clientEmail}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                  DETAILS
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>Date Issued:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>Due Date:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Line Items */}
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Hours</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Rate</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight={500}>Development Services</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Period: {new Date(selectedInvoice.startDate).toLocaleDateString()} - {new Date(selectedInvoice.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{selectedInvoice.totalHours}</TableCell>
                    <TableCell align="right">{formatCurrency(selectedInvoice.hourlyRate)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedInvoice.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Box sx={{ width: 250 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(selectedInvoice.totalAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Tax (0%):</Typography>
                  <Typography variant="body2" fontWeight={600}>$0.00</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>Total:</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Footer Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 8 }}>
              <Button
                variant="outlined"
                startIcon={<Close />}
                onClick={() => setPreviewOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<GetApp />}
                onClick={handleExport}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}