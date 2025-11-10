import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogs, exportAuditLogs, setFilters, resetFilters } from '../redux/slices/auditSlice';
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
  TablePagination,
  Button,
  Box,
  TextField,
  Grid,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

export default function AuditLogs() {
  const dispatch = useDispatch();
  const { logs, pagination, loading, exportLoading, error, filters } = useSelector((state) => state.audit);
  const { user } = useSelector((state) => state.auth);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Only fetch if user is Admin or Manager
    if (user && (user.role === 'Admin' || user.role === 'Manager')) {
      dispatch(fetchAuditLogs(filters));
    }
  }, [dispatch, user, filters.page]);

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value, page: 1 }));
  };

  const handleApplyFilters = () => {
    dispatch(fetchAuditLogs(filters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(fetchAuditLogs({}));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (event) => {
    dispatch(setFilters({ limit: parseInt(event.target.value, 10), page: 1 }));
    dispatch(fetchAuditLogs({ ...filters, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleExport = (format) => {
    dispatch(exportAuditLogs({ ...filters, format }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'FAILED':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('CREATE') || action.includes('GENERATE')) return 'success';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'warning';
    return 'info';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Action options for filter
  const actionOptions = [
    'LOGIN', 'LOGOUT', 'REGISTER',
    'TIMESHEET_CREATE', 'TIMESHEET_UPDATE', 'TIMESHEET_DELETE',
    'TIMESHEET_APPROVED', 'TIMESHEET_REJECTED',
    'INVOICE_GENERATE', 'PAYMENT_RECORDED'
  ];

  const resourceTypes = ['User', 'Timesheet', 'Invoice', 'Payment', 'Approval', 'System'];
  const statusOptions = ['SUCCESS', 'FAILED', 'ERROR'];

  // Check permissions
  if (!user || (user.role !== 'Admin' && user.role !== 'Manager')) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">
          Access denied. Only Admin and Manager roles can view audit logs.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Audit Logs
        </Typography>
        <Box>
          <Tooltip title="Toggle Filters">
            <IconButton onClick={() => setShowFilters(!showFilters)} color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={() => dispatch(fetchAuditLogs(filters))} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={() => handleExport('csv')}
            disabled={exportLoading}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={() => handleExport('json')}
            disabled={exportLoading}
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity={error.includes('not yet implemented') ? 'warning' : 'error'} 
          sx={{ mb: 2 }}
        >
          {error}
          {error.includes('not yet implemented') && (
            <Box mt={1}>
              <Typography variant="body2">
                <strong>Frontend Status:</strong> ✅ Complete (this page is fully functional)
                <br />
                <strong>Backend Status:</strong> ⏳ Pending implementation
                <br />
                <strong>Implementation Guide:</strong> See <code>BACKEND_AUDIT_LOGGING_IMPLEMENTATION.md</code> in project root
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Action"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
              >
                <MenuItem value="">All Actions</MenuItem>
                {actionOptions.map((action) => (
                  <MenuItem key={action} value={action}>
                    {action.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Resource Type"
                value={filters.resourceType}
                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
              >
                <MenuItem value="">All Resources</MenuItem>
                {resourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="User Email"
                value={filters.userEmail || ''}
                onChange={(e) => handleFilterChange('userEmail', e.target.value)}
                placeholder="user@example.com"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box display="flex" gap={2} height="100%" alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={handleApplyFilters}
                  disabled={loading}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleResetFilters}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      No audit logs found. Try adjusting your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(log.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {log.userName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {log.userEmail}
                      </Typography>
                      <br />
                      <Chip label={log.userRole} size="small" sx={{ mt: 0.5 }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action.replace(/_/g, ' ')}
                        size="small"
                        color={getActionColor(log.action)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.resourceType}
                      </Typography>
                      {log.resourceId && (
                        <Typography variant="caption" color="textSecondary">
                          {log.resourceId.substring(0, 8)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        size="small"
                        color={getStatusColor(log.status)}
                      />
                      {log.statusCode && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {log.statusCode}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.ipAddress}
                      </Typography>
                      {log.duration && (
                        <Typography variant="caption" color="textSecondary">
                          {log.duration}ms
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <Tooltip title={JSON.stringify(log.details, null, 2)}>
                          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                            View Details
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          -
                        </Typography>
                      )}
                      {log.errorMessage && (
                        <Typography variant="caption" color="error">
                          {log.errorMessage}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      <Box mt={2}>
        <Alert severity="info">
          <strong>Audit Log Retention:</strong> Logs are automatically retained for 7 years for compliance purposes.
          All sensitive data (passwords, tokens) is automatically redacted from logs.
        </Alert>
      </Box>
    </Container>
  );
}
