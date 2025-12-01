import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    AvatarGroup,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    Group,
    CheckCircle,
    Cancel,
    MoreVert,
    TrendingUp,
    AssignmentTurnedIn,
    Warning
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ManagerDashboard({ user, timesheets }) {
    // Mock data for team productivity
    const teamData = [
        { week: 'W1', hours: 140 },
        { week: 'W2', hours: 155 },
        { week: 'W3', hours: 138 },
        { week: 'W4', hours: 162 },
    ];

    const pendingApprovals = timesheets.filter(t => t.status === 'Pending');

    return (
        <Box className="fade-in">
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} className="gradient-text" gutterBottom>
                        Team Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your team's performance and approvals
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Group />}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Manage Team
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AssignmentTurnedIn />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                    >
                        Approve All
                    </Button>
                </Box>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card className="hover-lift" sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                    <Group />
                                </Box>
                                <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                            </Box>
                            <Typography variant="h3" fontWeight={700}>12</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Team Members</Typography>
                            <Box sx={{ mt: 2 }}>
                                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14, borderColor: 'transparent' } }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                    <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                                    <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                                    <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                                </AvatarGroup>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className="hover-lift" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: '#fff7e6', borderRadius: 2, color: '#ffa116' }}>
                                    <Warning />
                                </Box>
                                <Chip label="Urgent" size="small" sx={{ bgcolor: '#fff7e6', color: '#ffa116', fontWeight: 600 }} />
                            </Box>
                            <Typography variant="h3" fontWeight={700}>{pendingApprovals.length}</Typography>
                            <Typography variant="body2" color="text.secondary">Pending Approvals</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                3 items overdue by 2+ days
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card className="hover-lift" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: '#e6fffa', borderRadius: 2, color: '#11998e' }}>
                                    <TrendingUp />
                                </Box>
                                <Chip label="+8%" size="small" sx={{ bgcolor: '#e6fffa', color: '#11998e', fontWeight: 600 }} />
                            </Box>
                            <Typography variant="h3" fontWeight={700}>595</Typography>
                            <Typography variant="body2" color="text.secondary">Total Team Hours</Typography>
                            <Box sx={{ height: 40, mt: 1 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={teamData}>
                                        <Area type="monotone" dataKey="hours" stroke="#11998e" fill="#e6fffa" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Pending Approvals List */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }} className="hover-lift">
                        <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Pending Approvals
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableRow>
                                        <TableCell>Employee</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Hours</TableCell>
                                        <TableCell>Project</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingApprovals.length > 0 ? pendingApprovals.map((ts) => (
                                        <TableRow key={ts._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                                                        {ts.user?.name?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {ts.user?.name || 'Unknown User'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{new Date(ts.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip label={`${ts.totalHours} hrs`} size="small" />
                                            </TableCell>
                                            <TableCell>Project Alpha</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="success" size="small" sx={{ mr: 1 }}>
                                                    <CheckCircle />
                                                </IconButton>
                                                <IconButton color="error" size="small">
                                                    <Cancel />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                No pending approvals 🎉
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Team Productivity Chart */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }} className="hover-lift">
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Productivity Trend
                        </Typography>
                        <Box sx={{ height: 300, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={teamData}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="hours" stroke="#667eea" fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
