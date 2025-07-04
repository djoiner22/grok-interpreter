import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  AutoAwesome as GrokIcon,
  Build as ProjectIcon,
  Folder as ProjectsIcon,
  Code as WorkspaceIcon,
  Psychology as ModelsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  RocketLaunch,
  CreateNewFolder,
  History,
  Star,
  Circle as StatusIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';

const SIDEBAR_WIDTH = 280;

const Sidebar = ({ open, onClose, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();
  const { connected } = useSocket();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      path: '/dashboard',
      color: '#667eea',
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: ChatIcon,
      path: '/chat',
      color: '#48bb78',
      badge: state.chat.messages.length > 0 ? state.chat.messages.length : null,
    },
    {
      id: 'project-wizard',
      label: 'Grok Project Wizard',
      icon: GrokIcon,
      path: '/project-wizard',
      color: '#ed8936',
      subtitle: 'AI-powered project creation',
    },
    {
      id: 'divider-1',
      type: 'divider',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: ProjectsIcon,
      expandable: true,
      expanded: projectsExpanded,
      onToggle: () => setProjectsExpanded(!projectsExpanded),
      color: '#38b2ac',
      children: [
        {
          id: 'projects-browser',
          label: 'Browse Projects',
          path: '/projects',
          icon: ProjectIcon,
        },
        {
          id: 'projects-recent',
          label: 'Recent Projects',
          icon: History,
          badge: state.projects.recentProjects.length,
        },
        {
          id: 'projects-create',
          label: 'Create Project',
          path: '/project-wizard',
          icon: CreateNewFolder,
        },
      ],
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: WorkspaceIcon,
      path: '/workspace',
      color: '#9f7aea',
      subtitle: state.workspace.path,
    },
    {
      id: 'divider-2',
      type: 'divider',
    },
    {
      id: 'models',
      label: 'Model Configuration',
      icon: ModelsIcon,
      path: '/models',
      color: '#f56565',
      subtitle: state.models.selected,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      path: '/settings',
      color: '#718096',
    },
  ];

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
      if (window.innerWidth < 768) {
        onClose();
      }
    }
  };

  const connectionStatus = connected ? 'connected' : 'disconnected';
  const connectionColor = connected ? '#48bb78' : '#f56565';

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          background: darkMode 
            ? 'linear-gradient(135deg, #1a1f3a 0%, #2d3748 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mr: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            ●
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
              Open Interpreter
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Grok-Cursor Edition
            </Typography>
          </Box>
        </Box>

        {/* Connection Status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <StatusIcon
            sx={{
              color: connectionColor,
              fontSize: 12,
              mr: 1,
              animation: connected ? 'none' : 'pulse 2s infinite',
            }}
          />
          <Typography variant="caption" sx={{ flexGrow: 1, opacity: 0.9 }}>
            {connected ? 'Connected' : 'Disconnected'}
          </Typography>
          <Chip
            label={state.models.selected}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {navigationItems.map((item) => {
            if (item.type === 'divider') {
              return <Divider key={item.id} sx={{ my: 1 }} />;
            }

            if (item.expandable) {
              return (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={item.onToggle}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: item.color,
                          minWidth: 40,
                        }}
                      >
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{ '& .MuiListItemText-primary': { fontWeight: 500 } }}
                      />
                      {item.expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem key={child.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigate(child.path)}
                            selected={isActive(child.path)}
                            sx={{
                              pl: 4,
                              borderRadius: 2,
                              mb: 0.5,
                              ml: 1,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                              '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                },
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: isActive(child.path) ? 'inherit' : 'text.secondary',
                                minWidth: 36,
                              }}
                            >
                              {child.badge && child.badge > 0 ? (
                                <Badge badgeContent={child.badge} color="secondary">
                                  <child.icon />
                                </Badge>
                              ) : (
                                <child.icon />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.label}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.875rem',
                                  fontWeight: isActive(child.path) ? 600 : 400,
                                },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(4px)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path) ? 'inherit' : item.color,
                        minWidth: 40,
                      }}
                    >
                      {item.badge && item.badge > 0 ? (
                        <Badge badgeContent={item.badge} color="secondary">
                          <item.icon />
                        </Badge>
                      ) : (
                        <item.icon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.subtitle}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isActive(item.path) ? 600 : 500,
                        },
                        '& .MuiListItemText-secondary': {
                          fontSize: '0.75rem',
                          opacity: 0.7,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* Quick Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1,
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Create Grok Project">
            <IconButton
              size="small"
              onClick={() => handleNavigate('/project-wizard')}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <RocketLaunch />
            </IconButton>
          </Tooltip>
          <Tooltip title="Start Chat">
            <IconButton
              size="small"
              onClick={() => handleNavigate('/chat')}
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Browse Projects">
            <IconButton
              size="small"
              onClick={() => handleNavigate('/projects')}
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                '&:hover': { bgcolor: 'success.dark' },
              }}
            >
              <Star />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Recent Projects */}
        {state.projects.recentProjects.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 1,
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Recent Projects
            </Typography>
            {state.projects.recentProjects.slice(0, 3).map((project) => (
              <Box
                key={project.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => {
                  // Navigate to project or open in Cursor
                  console.log('Open project:', project);
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mr: 1,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    flexGrow: 1,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: open ? 'block' : 'none' },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              border: 'none',
              boxShadow: 3,
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;