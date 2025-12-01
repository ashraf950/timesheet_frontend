import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimesheets } from "../redux/slices/timesheetSlice";
import { fetchInvoices } from "../redux/slices/invoiceSlice";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Chip,
} from "@mui/material";
import {
    AccessTime,
    AttachMoney,
    CheckCircle,
    Warning,
    TrendingUp,
    TrendingDown,
} from "@mui/icons-material";
import RevenueChart from "../components/charts/RevenueChart";
import PredictiveInsights from "../components/ai/PredictiveInsights";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { list: timesheets, loading: timesheetLoading } = useSelector(
        (state) => state.timesheet
    );
    const { invoices, loading: invoiceLoading } = useSelector(
        (state) => state.invoice
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchTimesheets());
        dispatch(fetchInvoices());
    }, [dispatch]);

    const loadingState = timesheetLoading || invoiceLoading;

    if (loadingState) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Role-based rendering
    if (user?.role === 'employee') {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <EmployeeDashboard user={user} timesheets={timesheets} />
            </Container>
        );
    }

    if (user?.role === 'manager') {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <ManagerDashboard user={user} timesheets={timesheets} />
            </Container>
        );
    }

    // Default / Admin View (Executive Dashboard)
    const summary = {
        totalHours: timesheets.reduce((acc, curr) => acc + curr.totalHours, 0),
        pendingApprovals: timesheets.filter((t) => t.status === "Pending").length,
        approvedInvoices: invoices.filter((i) => i.status === "Paid").length,
        totalRevenue: invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
        thisWeekHours: 38, // Mocked for demo
        thisMonthHours: 152, // Mocked for demo
        averageDailyHours: 7.6, // Mocked for demo
        lastTimesheetDate: timesheets.length > 0 ? timesheets[0].date : null,
        recentInvoices: invoices.length,
        pendingPayments: invoices.filter(i => i.status === 'Sent').length
    };

    const kpiCards = [
        {
            title: "Total Hours Logged",
            value: `${summary.totalHours} hrs`,
            icon: <AccessTime sx={{ fontSize: 28, color: "white" }} />,
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Pending Approvals",
            value: summary.pendingApprovals,
            icon: <Warning sx={{ fontSize: 28, color: "white" }} />,
            gradient: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
            trend: "-5%",
            trendUp: false,
            trendUp: false,
        },
        {
            title: "Approved Invoices",
            value: summary.approvedInvoices,
            icon: <CheckCircle sx={{ fontSize: 28, color: "white" }} />,
            gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Payments Collected",
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalRevenue),
            icon: <AttachMoney sx={{ fontSize: 28, color: "white" }} />,
            gradient: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
            trend: "+24%",
            trendUp: true,
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4, position: 'relative' }} className="fade-in">
                <Paper
                    sx={{
                        p: 4,
                        background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h4" fontWeight={800} gutterBottom className="gradient-text">
                            Welcome back, {user?.name || 'Admin'}! 👋
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                            Here's the executive overview of your organization's performance.
                            You have {summary.pendingApprovals} items requiring attention.
                        </Typography>
                    </Box>

                    {/* Decorative background elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        zIndex: 0
                    }} />
                </Paper>
            </Box>

            {/* AI Predictive Insights Panel */}
            <Box className="slide-in-up" sx={{ animationDelay: '0.1s' }}>
                <PredictiveInsights />
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {kpiCards.map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            className="hover-lift scale-in"
                            sx={{
                                height: '100%',
                                background: kpi.gradient,
                                color: 'white',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                    }}>
                                        {kpi.icon}
                                    </Box>
                                    <Chip
                                        icon={kpi.trendUp ? <TrendingUp /> : <TrendingDown />}
                                        label={kpi.trend}
                                        size="small"
                                        sx={{
                                            background: kpi.trendUp ? 'rgba(56, 239, 125, 0.2)' : 'rgba(245, 87, 108, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            '& .MuiChip-icon': { color: 'white' }
                                        }}
                                    />
                                </Box>
                                <Typography variant="h3" component="div" fontWeight={700} sx={{ mb: 0.5 }}>
                                    {kpi.value}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                    {kpi.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper
                        className="fade-in hover-lift"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'white',
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                            📊 Revenue Trend
                        </Typography>
                        <RevenueChart />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        className="fade-in hover-lift"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'white',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                            ⚡ Quick Stats
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    This Week's Hours
                                </Typography>
                                <Typography variant="h5" fontWeight={700} color="primary">
                                    {summary.thisWeekHours || 0} hrs
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)',
                                    border: '1px solid rgba(17, 153, 142, 0.2)',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    This Month's Hours
                                </Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: '#11998e' }}>
                                    {summary.thisMonthHours || 0} hrs
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                                    border: '1px solid rgba(79, 172, 254, 0.2)',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Average Daily Hours
                                </Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: '#4facfe' }}>
                                    {summary.averageDailyHours || 0} hrs
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        className="fade-in hover-lift"
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'white',
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                            🕒 Recent Activity
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Last Timesheet
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {summary.lastTimesheetDate ? new Date(summary.lastTimesheetDate).toLocaleDateString() : 'None'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Recent Invoices
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {summary.recentInvoices || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Pending Payments
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {summary.pendingPayments || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
