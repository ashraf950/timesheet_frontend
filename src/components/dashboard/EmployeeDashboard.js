import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    LinearProgress,
    Card,
    CardContent,
    Avatar,
    Chip
} from '@mui/material';
import {
    AccessTime,
    CheckCircle,
    Schedule,
    Add,
    TrendingUp,
    EventNote
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function EmployeeDashboard({ user, timesheets }) {
    // Mock data for the chart
    const weeklyData = [
        { day: 'Mon', hours: 8 },
        { day: 'Tue', hours: 7.5 },
        { day: 'Wed', hours: 8 },
        { day: 'Thu', hours: 8.5 },
        { day: 'Fri', hours: 6 }, // Today
    ];

    const stats = {
        thisWeek: 38,
        goal: 40,
        pending: timesheets.filter(t => t.status === 'Pending').length,
        approved: timesheets.filter(t => t.status === 'Approved').length
    };

    const progress = (stats.thisWeek / stats.goal) * 100;

    return (
        <Box className="fade-in">
            {/* Welcome Banner */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                className="hover-lift"
            >
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Hello, {user?.name || 'Employee'}! 🚀
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            You've logged <strong>{stats.thisWeek} hours</strong> this week. Almost at your goal!
                        </Typography>
                        <Box sx={{ mt: 2, width: '100%', maxWidth: 400 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={600}>Weekly Goal</Typography>
                                <Typography variant="caption">{Math.round(progress)}%</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': { bgcolor: '#38ef7d' }
                                }}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{
                            bgcolor: 'white',
                            color: '#764ba2',
                            fontWeight: 700,
                            px: 3,
                            py: 1.5,
                            borderRadius: 3,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                    >
                        Log Time
                    </Button>
                </Box>

                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
            </Paper>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Card className="hover-lift" sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'rgba(102, 126, 234, 0.1)', borderRadius: 2, color: '#667eea' }}>
                                            <AccessTime />
                                        </Box>
                                        <Chip label="+2.5 hrs" size="small" sx={{ bgcolor: '#e6fffa', color: '#11998e', fontWeight: 600 }} />
                                    </Box>
                                    <Typography variant="h4" fontWeight={700} gutterBottom>
                                        {stats.thisWeek}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Hours this week
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card className="hover-lift" sx={{ borderRadius: 3, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 161, 22, 0.1)', borderRadius: 2, color: '#ffa116' }}>
                                            <Schedule />
                                        </Box>
                                        <Chip label="Action Needed" size="small" sx={{ bgcolor: '#fff7e6', color: '#ffa116', fontWeight: 600 }} />
                                    </Box>
                                    <Typography variant="h4" fontWeight={700} gutterBottom>
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending Approvals
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Chart */}
                    <Paper sx={{ p: 3, borderRadius: 3, height: 350 }} className="hover-lift">
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Weekly Activity
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                                    {weeklyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#764ba2' : '#667eea'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }} className="hover-lift">
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                            Recent Timesheets
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {timesheets.slice(0, 4).map((ts, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: ts.status === 'Approved' ? '#e6fffa' : '#fff7e6', color: ts.status === 'Approved' ? '#11998e' : '#ffa116', mr: 2 }}>
                                        <EventNote fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {new Date(ts.date).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {ts.totalHours} Hours
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={ts.status}
                                        size="small"
                                        sx={{
                                            height: 24,
                                            fontSize: '0.7rem',
                                            bgcolor: ts.status === 'Approved' ? '#e6fffa' : '#fff7e6',
                                            color: ts.status === 'Approved' ? '#11998e' : '#ffa116',
                                            fontWeight: 700
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
