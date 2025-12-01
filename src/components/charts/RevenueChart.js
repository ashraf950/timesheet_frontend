import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const RevenueChart = ({ data = [] }) => {
    // Default data if none provided
    const defaultData = [
        { month: 'Jan', revenue: 4000, invoices: 12 },
        { month: 'Feb', revenue: 3000, invoices: 10 },
        { month: 'Mar', revenue: 5000, invoices: 15 },
        { month: 'Apr', revenue: 4500, invoices: 13 },
        { month: 'May', revenue: 6000, invoices: 18 },
        { month: 'Jun', revenue: 5500, invoices: 16 },
    ];

    const chartData = data.length > 0 ? data : defaultData;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    sx={{
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        {payload[0].payload.month}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Revenue: ${payload[0].value.toLocaleString()}
                    </Typography>
                    {payload[1] && (
                        <Typography variant="body2" color="secondary">
                            Invoices: {payload[1].value}
                        </Typography>
                    )}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Box>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#764ba2" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="month"
                        stroke="#718096"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <YAxis
                        stroke="#718096"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '0.875rem', paddingTop: '10px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#667eea"
                        strokeWidth={3}
                        dot={{ fill: '#667eea', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Revenue ($)"
                    />
                    <Line
                        type="monotone"
                        dataKey="invoices"
                        stroke="#764ba2"
                        strokeWidth={2}
                        dot={{ fill: '#764ba2', r: 4 }}
                        name="Invoices"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RevenueChart;
