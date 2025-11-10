import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummary } from "../redux/slices/dashboardSlice";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  AccessTime,
  PendingActions,
  Receipt,
  Payment,
} from "@mui/icons-material";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch analytics if user has permission (not showing 403 for employees)
    dispatch(fetchSummary()).catch(() => {
      // Silently handle permission errors
      console.log("Analytics not available for this user role");
    });
  }, [dispatch]);

  const kpiCards = [
    {
      title: "Total Hours Logged",
      value: summary.totalHours || 0,
      icon: <AccessTime sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
      suffix: 'hrs'
    },
    {
      title: "Pending Approvals",
      value: summary.pendingApprovals || 0,
      icon: <PendingActions sx={{ fontSize: 40, color: '#ed6c02' }} />,
      color: '#fff3e0',
      suffix: 'items'
    },
    {
      title: "Approved Invoices",
      value: summary.approvedInvoices || 0,
      icon: <Receipt sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#e8f5e8',
      suffix: 'invoices'
    },
    {
      title: "Payments Collected",
      value: summary.paymentsCollected || 0,
      icon: <Payment sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      prefix: '$'
    }
  ];

  const formatValue = (value, prefix = '', suffix = '') => {
    if (prefix === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    return `${prefix}${value}${suffix ? ' ' + suffix : ''}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name || user?.email}!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Here's your timesheet dashboard overview
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error && error.includes("Access denied") ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Welcome to your Dashboard!
          </Typography>
          <Typography color="textSecondary" paragraph>
            Analytics dashboard is available for managers and admins only.
          </Typography>
          <Typography color="textSecondary">
            As an employee, you can:
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Submit your daily timesheets
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • View your timesheet history
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Track approval status
            </Typography>
            <Typography variant="body2">
              • Use auto-fill to save time
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="primary">
              Navigate to "Timesheet" to get started!
            </Typography>
          </Box>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Error loading dashboard data
          </Typography>
          <Typography color="textSecondary">
            {error}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {kpiCards.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', backgroundColor: kpi.color }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {kpi.icon}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          {formatValue(kpi.value, kpi.prefix, kpi.suffix)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {kpi.title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Additional Dashboard Content */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      This Week's Hours: {summary.thisWeekHours || 0} hrs
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      This Month's Hours: {summary.thisMonthHours || 0} hrs
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Average Daily Hours: {summary.averageDailyHours || 0} hrs
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Last Timesheet: {summary.lastTimesheetDate ? new Date(summary.lastTimesheetDate).toLocaleDateString() : 'None'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Recent Invoices: {summary.recentInvoices || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Pending Payments: {summary.pendingPayments || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}