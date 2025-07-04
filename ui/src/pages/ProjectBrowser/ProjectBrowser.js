import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

const ProjectBrowser = () => {
  const { actions } = useApp();

  useEffect(() => {
    actions.setCurrentPage('projects');
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Project Browser
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will show all your projects and allow you to manage them.
      </Typography>
    </Box>
  );
};

export default ProjectBrowser;