import React from 'react';
import { Paper, Box, Typography, Grid, LinearProgress, Chip, Tooltip } from '@mui/material';
import {
    AutoAwesome,
    TrendingUp,
    Warning,
    CheckCircle,
    Psychology,
    Timeline
} from '@mui/icons-material';

const InsightCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Box sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 3, height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: color, transform: 'translateY(-2px)' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color }}>
                {icon}
            </Box>
            {trend && (
                <Chip
                    label={trend}
                    size="small"
                    sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, height: 24 }}
                />
            )}
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            {value}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
            {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
            {subtitle}
        </Typography>
    </Box>
);

export default function PredictiveInsights() {
    return (
        <Paper
            className="glass hover-lift"
            sx={{
                p: 3,
                borderRadius: 3,
                mb: 4,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration */}
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, transform: 'rotate(15deg)' }}>
                <Psychology sx={{ fontSize: 200 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AutoAwesome sx={{ color: '#667eea', mr: 1.5, fontSize: 28 }} className="pulse" />
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        AI Predictive Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Real-time analysis powered by machine learning
                    </Typography>
                </Box>
                <Chip
                    icon={<CheckCircle sx={{ fontSize: '16px !important' }} />}
                    label="System Active"
                    size="small"
                    sx={{ ml: 'auto', bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
                />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <InsightCard
                        title="Cash Flow Forecast"
                        value="$42.5k"
                        subtitle="Predicted revenue for next 30 days based on current contracts"
                        icon={<Timeline />}
                        color="#11998e"
                        trend="+15%"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <InsightCard
                        title="Anomaly Detection"
                        value="2 Alerts"
                        subtitle="Unusual hours logged in Project Alpha requiring review"
                        icon={<Warning />}
                        color="#ff416c"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#667eea15', color: '#667eea', mr: 2 }}>
                                <Psychology />
                            </Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Model Confidence
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={600}>Timesheet Auto-Fill</Typography>
                                <Typography variant="caption" fontWeight={700} color="primary">98%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={98} sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: '#667eea' } }} />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" fontWeight={600}>Payment Matching</Typography>
                                <Typography variant="caption" fontWeight={700} color="primary">94%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={94} sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { bgcolor: '#764ba2' } }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
