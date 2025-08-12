import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

const Settings = ({ darkMode, onToggleDarkMode }) => {
  const { actions } = useApp();

  useEffect(() => {
    actions.setCurrentPage('settings');
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure your Open Interpreter preferences here.
      </Typography>
    </Box>
  );
};

export default Settings;