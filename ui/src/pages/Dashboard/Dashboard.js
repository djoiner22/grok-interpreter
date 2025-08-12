import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AutoAwesome as GrokIcon,
  RocketLaunch as LaunchIcon,
  Chat as ChatIcon,
  Folder as ProjectIcon,
  Code as CodeIcon,
  TrendingUp as TrendingIcon,
  Circle as StatusIcon,
  PlayArrow as PlayIcon,
  History as HistoryIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  Psychology as AIIcon,
  Build as BuildIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { connected, checkHealth } = useSocket();
  const [systemStats, setSystemStats] = useState({
    projectsCreated: 12,
    messagesExchanged: 148,
    modelsUsed: 3,
    uptime: '2h 34m',
  });

  useEffect(() => {
    actions.setCurrentPage('dashboard');
    checkHealth();
  }, []);

  // Mock data for charts
  const activityData = [
    { name: 'Mon', projects: 2, messages: 24 },
    { name: 'Tue', projects: 3, messages: 31 },
    { name: 'Wed', projects: 1, messages: 18 },
    { name: 'Thu', projects: 4, messages: 42 },
    { name: 'Fri', projects: 2, messages: 28 },
    { name: 'Sat', projects: 1, messages: 15 },
    { name: 'Sun', projects: 3, messages: 35 },
  ];

  const modelUsageData = [
    { name: 'Grok-3-Beta', usage: 45, color: '#667eea' },
    { name: 'GPT-4', usage: 30, color: '#48bb78' },
    { name: 'Claude-3.5', usage: 25, color: '#ed8936' },
  ];

  const quickActions = [
    {
      title: 'Create Grok Project',
      description: 'Generate a new project with AI assistance',
      icon: GrokIcon,
      color: 'primary',
      action: () => navigate('/project-wizard'),
      gradient: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    },
    {
      title: 'Start AI Chat',
      description: 'Begin a conversation with your AI assistant',
      icon: ChatIcon,
      color: 'secondary',
      action: () => navigate('/chat'),
      gradient: 'linear-gradient(45deg, #48bb78 30%, #38a169 90%)',
    },
    {
      title: 'Browse Projects',
      description: 'View and manage your existing projects',
      icon: ProjectIcon,
      color: 'info',
      action: () => navigate('/projects'),
      gradient: 'linear-gradient(45deg, #38b2ac 30%, #2c7a7b 90%)',
    },
    {
      title: 'Configure Models',
      description: 'Set up and customize AI models',
      icon: AIIcon,
      color: 'warning',
      action: () => navigate('/models'),
      gradient: 'linear-gradient(45deg, #ed8936 30%, #dd6b20 90%)',
    },
  ];

  const recentActivity = [
    { type: 'project', title: 'Created "React Todo App"', time: '2 hours ago', icon: ProjectIcon },
    { type: 'chat', title: 'AI Chat Session', time: '3 hours ago', icon: ChatIcon },
    { type: 'model', title: 'Switched to Grok-3-Beta', time: '5 hours ago', icon: AIIcon },
    { type: 'project', title: 'Generated "Python API Server"', time: '1 day ago', icon: CodeIcon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back, {state.user.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your Open Interpreter workspace
            </Typography>
          </Box>
        </motion.div>

        {/* Status Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StatusIcon
                      sx={{
                        color: connected ? '#4ade80' : '#ef4444',
                        fontSize: 16,
                        mr: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      System Status
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {connected ? 'Online' : 'Offline'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Uptime: {systemStats.uptime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ProjectIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Projects Created
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {systemStats.projectsCreated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +3 this week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChatIcon sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Messages
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {systemStats.messagesExchanged}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +23 today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AIIcon sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Active Model
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: '1.5rem' }}>
                    {state.models.selected}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready to use
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: action.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <action.icon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Activity Chart */}
          <Grid item xs={12} md={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Activity Overview
                    </Typography>
                    <Chip
                      label="Last 7 days"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="#667eea"
                        strokeWidth={3}
                        dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        stroke="#48bb78"
                        strokeWidth={3}
                        dot={{ fill: '#48bb78', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <Tooltip title="Refresh">
                      <IconButton size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <List>
                    {recentActivity.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem disablePadding>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                              }}
                            >
                              <item.icon sx={{ fontSize: 16 }} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            secondary={item.time}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                            }}
                            secondaryTypographyProps={{
                              fontSize: '0.75rem',
                            }}
                          />
                        </ListItem>
                        {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Model Usage */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Model Usage
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={modelUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="usage" fill="#667eea" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Projects */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Projects
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<PlayIcon />}
                      onClick={() => navigate('/projects')}
                    >
                      View All
                    </Button>
                  </Box>
                  {state.projects.recentProjects.length > 0 ? (
                    <List>
                      {state.projects.recentProjects.slice(0, 3).map((project, index) => (
                        <React.Fragment key={project.id}>
                          <ListItem disablePadding>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'secondary.main',
                                }}
                              >
                                {project.name.charAt(0)}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={project.name}
                              secondary={project.description}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                              }}
                              secondaryTypographyProps={{
                                fontSize: '0.75rem',
                              }}
                            />
                          </ListItem>
                          {index < Math.min(state.projects.recentProjects.length, 3) - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No recent projects yet
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<GrokIcon />}
                        onClick={() => navigate('/project-wizard')}
                      >
                        Create First Project
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;