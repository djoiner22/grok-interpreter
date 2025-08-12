import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

const WorkspaceManager = () => {
  const { actions } = useApp();

  useEffect(() => {
    actions.setCurrentPage('workspace');
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Workspace Manager
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your project workspace, files, and folder structure here.
      </Typography>
    </Box>
  );
};

export default WorkspaceManager;