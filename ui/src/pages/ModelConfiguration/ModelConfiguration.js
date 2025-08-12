import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

const ModelConfiguration = () => {
  const { actions } = useApp();

  useEffect(() => {
    actions.setCurrentPage('models');
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Model Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure AI models, API keys, and model settings here.
      </Typography>
    </Box>
  );
};

export default ModelConfiguration;