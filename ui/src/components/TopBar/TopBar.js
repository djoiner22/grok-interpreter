import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Chip,
  Tooltip,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Circle as ConnectionIcon,
  Refresh as RefreshIcon,
  AutoAwesome as GrokIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';
import { motion } from 'framer-motion';

const TopBar = ({ onMenuClick, darkMode, onToggleDarkMode, sidebarOpen }) => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { connected, reconnect } = useSocket();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const connectionColor = connected ? 'success' : 'error';
  const connectionText = connected ? 'Connected' : 'Disconnected';

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: sidebarOpen ? 'none' : 'block' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {state.app.currentPage === 'dashboard' && 'Dashboard'}
          {state.app.currentPage === 'chat' && 'AI Chat'}
          {state.app.currentPage === 'project-wizard' && 'Project Wizard'}
          {state.app.currentPage === 'projects' && 'Projects'}
          {state.app.currentPage === 'workspace' && 'Workspace'}
          {state.app.currentPage === 'models' && 'Models'}
          {state.app.currentPage === 'settings' && 'Settings'}
        </Typography>

        {/* Connection Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Chip
              icon={<ConnectionIcon />}
              label={connectionText}
              color={connectionColor}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                '& .MuiChip-icon': {
                  fontSize: 12,
                  animation: connected ? 'none' : 'pulse 2s infinite',
                },
              }}
            />
          </motion.div>
          
          {!connected && (
            <Tooltip title="Reconnect">
              <IconButton
                size="small"
                onClick={reconnect}
                sx={{ ml: 1 }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Current Model */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Tooltip title="Current AI Model">
            <Chip
              icon={state.models.selected.includes('grok') ? <GrokIcon /> : <AIIcon />}
              label={state.models.selected}
              color="primary"
              variant="filled"
              size="small"
              sx={{
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
              onClick={() => navigate('/models')}
            />
          </Tooltip>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
          <Tooltip title="Create Grok Project">
            <Button
              variant="contained"
              size="small"
              startIcon={<GrokIcon />}
              onClick={() => navigate('/project-wizard')}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8 30%, #68597a 90%)',
                },
              }}
            >
              New Project
            </Button>
          </Tooltip>
        </Box>

        {/* Notifications */}
        <Box sx={{ flexGrow: 0, mr: 1 }}>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleOpenNotifications}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-notifications"
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
          >
            <MenuItem onClick={handleCloseNotifications}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Theme Toggle */}
        <Box sx={{ flexGrow: 0, mr: 1 }}>
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              size="large"
              onClick={onToggleDarkMode}
              color="inherit"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="User Settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {state.user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* User Info */}
            <MenuItem disabled>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    mr: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {state.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {state.user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {state.user.email || 'Local User'}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            
            <Divider />
            
            {/* Menu Items */}
            <MenuItem onClick={() => handleNavigate('/dashboard')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleNavigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={() => handleNavigate('/models')}>
              <ListItemIcon>
                <AIIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Model Configuration</ListItemText>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleCloseUserMenu}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;