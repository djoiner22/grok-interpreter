import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Context providers
import { AppProvider } from './contexts/AppContext';
import { SocketProvider } from './contexts/SocketContext';

// Components
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import LoadingScreen from './components/Loading/LoadingScreen';

// Pages
import ChatInterface from './pages/ChatInterface/ChatInterface';
import ProjectWizard from './pages/ProjectWizard/ProjectWizard';
import ProjectBrowser from './pages/ProjectBrowser/ProjectBrowser';
import Settings from './pages/Settings/Settings';
import ModelConfiguration from './pages/ModelConfiguration/ModelConfiguration';
import WorkspaceManager from './pages/WorkspaceManager/WorkspaceManager';
import Dashboard from './pages/Dashboard/Dashboard';

// Theme configuration
const createAppTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#667eea',
      light: '#8fa7f3',
      dark: '#4a5ab3',
    },
    secondary: {
      main: '#764ba2',
      light: '#9a6bc4',
      dark: '#5a3677',
    },
    background: {
      default: darkMode ? '#0a0e27' : '#f5f7fa',
      paper: darkMode ? '#1a1f3a' : '#ffffff',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#2d3748',
      secondary: darkMode ? '#a0aec0' : '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: darkMode 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('grokit-theme');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = createAppTheme(darkMode);

  useEffect(() => {
    // Simulate loading time and check for backend connection
    const initializeApp = async () => {
      try {
        // Check if backend is available
        const response = await fetch('/api/health');
        if (!response.ok) {
          console.warn('Backend not available, running in demo mode');
        }
      } catch (error) {
        console.warn('Backend not available, running in demo mode');
      } finally {
        setTimeout(() => setLoading(false), 1000); // Minimum loading time for UX
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('grokit-theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <SocketProvider>
          <Router>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
              {/* Sidebar */}
              <Sidebar 
                open={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                darkMode={darkMode}
              />
              
              {/* Main Content */}
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'margin-left 0.3s',
                  marginLeft: sidebarOpen ? { xs: 0, md: '280px' } : 0,
                }}
              >
                {/* Top Bar */}
                <TopBar 
                  onMenuClick={toggleSidebar}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                  sidebarOpen={sidebarOpen}
                />
                
                {/* Routes */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto',
                    bgcolor: 'background.default',
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/project-wizard" element={<ProjectWizard />} />
                    <Route path="/projects" element={<ProjectBrowser />} />
                    <Route path="/workspace" element={<WorkspaceManager />} />
                    <Route path="/models" element={<ModelConfiguration />} />
                    <Route path="/settings" element={<Settings darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          </Router>
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: darkMode ? '#1a1f3a' : '#ffffff',
                color: darkMode ? '#ffffff' : '#2d3748',
                border: `1px solid ${darkMode ? '#2d3748' : '#e2e8f0'}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#48bb78',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f56565',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </SocketProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;