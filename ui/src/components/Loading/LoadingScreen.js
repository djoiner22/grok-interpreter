import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper,
  useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
  textAlign: 'center',
  lineHeight: 1.2,
}));

const Tagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.1rem',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  maxWidth: 600,
}));

const LoadingContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  borderRadius: 0,
  boxShadow: 'none',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  marginTop: theme.spacing(3),
}));

const FeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(4),
  alignItems: 'center',
}));

const FeatureItem = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LoadingScreen = () => {
  const theme = useTheme();
  const [progress, setProgress] = React.useState(0);
  const [currentFeature, setCurrentFeature] = React.useState(0);

  const features = [
    '🤖 Initializing Grok AI models...',
    '⚡ Connecting to Cursor automation...',
    '🎯 Loading project wizards...',
    '🌐 Starting web interface...',
    '🔧 Preparing code execution environment...',
    '✨ Ready to create amazing projects!'
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, [features.length]);

  return (
    <LoadingContainer>
      <LogoContainer>
        <LogoText variant="h1">
          Grok'ed-Interpreter
        </LogoText>
      </LogoContainer>
      
      <Tagline>
        The most powerful AI development platform - combining Grok AI, Cursor automation, and intelligent code execution
      </Tagline>

      <ProgressContainer>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        />
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mt: 1 
          }}
        >
          {Math.round(progress)}% Complete
        </Typography>
      </ProgressContainer>

      <FeatureList>
        <FeatureItem>
          {features[currentFeature]}
        </FeatureItem>
      </FeatureList>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Powered by Grok AI × Cursor × React
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Version 1.0.0
        </Typography>
      </Box>
    </LoadingContainer>
  );
};

export default LoadingScreen;