import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon,
  Container,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Notifications,
  Settings,
  Person,
  AutoAwesome,
  Dashboard,
  AccessTime,
  Receipt,
  Payment,
  AdminPanelSettings,
} from '@mui/icons-material';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "AI detected 2 unusual timesheet entries", read: false },
    { id: 2, text: "Invoice #1024 payment received", read: false },
    { id: 3, text: "Weekly AI insights report ready", read: true },
  ]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard fontSize="small" />, roles: ['Employee', 'Manager', 'Admin', 'Finance'] },
    { label: 'Timesheet', path: '/timesheet', icon: <AccessTime fontSize="small" />, roles: ['Employee', 'Manager', 'Admin', 'Finance'] },
    { label: 'Invoices', path: '/invoices', icon: <Receipt fontSize="small" />, roles: ['Manager', 'Admin', 'Finance'] },
    { label: 'Payments', path: '/payments', icon: <Payment fontSize="small" />, roles: ['Manager', 'Admin', 'Finance'] },
    { label: 'Manager', path: '/manager', icon: <AdminPanelSettings fontSize="small" />, roles: ['Manager', 'Admin'] },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item =>
    !item.roles || item.roles.includes(user?.role)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 4, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <Box
              sx={{
                p: 1,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(118, 75, 162, 0.3)'
              }}
            >
              <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              className="gradient-text"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.5px',
                display: { xs: 'none', md: 'block' }
              }}
            >
              AI Timesheet
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '12px',
                    color: isActive ? 'white' : 'text.secondary',
                    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    boxShadow: isActive ? '0 4px 12px rgba(118, 75, 162, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Section: Notifications & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotificationMenu}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#667eea', bgcolor: 'rgba(102, 126, 234, 0.08)' }
                }}
              >
                <Badge badgeContent={unreadCount} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile */}
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  p: 0.5,
                  border: '2px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box',
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.2s'
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'transparent',
                    color: '#667eea',
                    fontWeight: 700
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Badge
                    color="primary"
                    badgeContent={user?.role}
                    sx={{
                      '& .MuiBadge-badge': {
                        position: 'static',
                        transform: 'none',
                        fontSize: '0.65rem',
                        height: 20,
                        minWidth: 20,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  />
                </Box>
              </Box>
              <Divider />
              <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 320,
                  filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.1))',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Notifications
                </Typography>
              </Box>
              {notifications.map((notification) => (
                <MenuItem key={notification.id} onClick={handleClose} sx={{ py: 1.5, whiteSpace: 'normal' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: notification.read ? 'transparent' : '#38ef7d',
                        mt: 1,
                        mr: 1.5,
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" color={notification.read ? 'text.secondary' : 'text.primary'}>
                      {notification.text}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              <Box sx={{ p: 1, borderTop: '1px solid #f0f0f0' }}>
                <Button fullWidth size="small" sx={{ color: '#667eea' }}>
                  View All
                </Button>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}