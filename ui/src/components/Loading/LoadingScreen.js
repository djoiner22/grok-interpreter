import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            ●
          </Box>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' },
              textAlign: 'center',
            }}
          >
            Open Interpreter
          </Typography>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              mb: 4,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            AI-powered development platform with Grok-Cursor integration
          </Typography>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{ color: 'white', fontWeight: 500 }}
              >
                AI
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              textAlign: 'center',
            }}
          >
            Initializing AI systems...
          </Typography>
        </motion.div>
      </Box>

      {/* Feature Pills */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)' }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 600,
          }}
        >
          {['Grok Integration', 'Cursor Automation', 'Project Generation', 'Real-time Chat'].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'white',
                }}
              >
                {feature}
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>

      {/* Version Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
      >
        <Typography
          variant="caption"
          sx={{
            opacity: 0.6,
            textAlign: 'center',
          }}
        >
          Version 1.0.0 - Grok-Cursor Edition
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;