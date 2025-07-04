import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as GrokIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  RocketLaunch as LaunchIcon,
  Psychology as AIIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext';
import ReactMarkdown from 'react-markdown';

const ProjectWizard = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { connected, createGrokProject, generateGrokOutline } = useSocket();
  
  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    type: 'web-app',
    technology: 'react',
    features: [],
    workspace: state.workspace.path,
    model: state.models.selected,
    useGrok: true,
    useCursor: true,
    autoImplement: false,
  });
  const [generatedOutline, setGeneratedOutline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    actions.setCurrentPage('project-wizard');
  }, []);

  const steps = [
    {
      label: 'Project Details',
      description: 'Basic information about your project',
      icon: DescriptionIcon,
    },
    {
      label: 'Configuration',
      description: 'Choose technology stack and features',
      icon: SettingsIcon,
    },
    {
      label: 'AI Generation',
      description: 'Generate project outline with Grok',
      icon: GrokIcon,
    },
    {
      label: 'Review & Create',
      description: 'Review and create your project',
      icon: BuildIcon,
    },
  ];

  const projectTypes = [
    {
      id: 'web-app',
      name: 'Web Application',
      description: 'Modern web application with frontend and backend',
      icon: '🌐',
      technologies: ['react', 'vue', 'angular', 'svelte'],
    },
    {
      id: 'api-server',
      name: 'API Server',
      description: 'Backend API service',
      icon: '🔌',
      technologies: ['nodejs', 'python', 'go', 'rust'],
    },
    {
      id: 'mobile-app',
      name: 'Mobile App',
      description: 'Cross-platform mobile application',
      icon: '📱',
      technologies: ['react-native', 'flutter', 'ionic'],
    },
    {
      id: 'desktop-app',
      name: 'Desktop App',
      description: 'Cross-platform desktop application',
      icon: '💻',
      technologies: ['electron', 'tauri', 'flutter'],
    },
    {
      id: 'data-science',
      name: 'Data Science',
      description: 'Data analysis and machine learning project',
      icon: '📊',
      technologies: ['python', 'r', 'julia'],
    },
    {
      id: 'blockchain',
      name: 'Blockchain',
      description: 'Smart contracts and DApps',
      icon: '⛓️',
      technologies: ['solidity', 'rust', 'typescript'],
    },
  ];

  const availableFeatures = [
    'Authentication',
    'Database Integration',
    'Real-time Updates',
    'File Upload',
    'Payment Processing',
    'Email Integration',
    'Social Login',
    'Push Notifications',
    'Analytics',
    'SEO Optimization',
    'PWA Support',
    'Testing Suite',
    'CI/CD Pipeline',
    'Docker Support',
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProjectDataChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const generateOutline = async () => {
    if (!connected) return;

    setIsGenerating(true);
    try {
      const description = `Create a ${projectData.type} project called "${projectData.name}":
${projectData.description}

Technology Stack: ${projectData.technology}
Features: ${projectData.features.join(', ')}

Please generate a detailed project outline including:
- Project structure
- Key files and directories
- Implementation steps
- Dependencies
- Configuration files`;

      generateGrokOutline(description, {
        model: projectData.model,
      });

      // Listen for the outline response (this would be handled by the socket context)
      // For now, we'll simulate it
      setTimeout(() => {
        setGeneratedOutline(`# ${projectData.name} - Project Outline

## Overview
${projectData.description}

## Technology Stack
- Primary: ${projectData.technology}
- Features: ${projectData.features.join(', ')}

## Project Structure
\`\`\`
${projectData.name}/
├── src/
├── public/
├── package.json
├── README.md
└── .gitignore
\`\`\`

## Implementation Plan
1. Setup project structure
2. Configure development environment
3. Implement core features
4. Add additional features
5. Testing and deployment

## Next Steps
Ready to implement with Cursor!`);
        setIsGenerating(false);
        handleNext();
      }, 2000);
    } catch (error) {
      console.error('Error generating outline:', error);
      setIsGenerating(false);
    }
  };

  const createProject = async () => {
    if (!connected) return;

    setIsCreating(true);
    try {
      const description = `${projectData.description}\n\nProject Type: ${projectData.type}\nTechnology: ${projectData.technology}\nFeatures: ${projectData.features.join(', ')}`;
      
      createGrokProject(description, {
        workspace: projectData.workspace,
        model: projectData.model,
        useCursor: projectData.useCursor,
        autoImplement: projectData.autoImplement,
      });

      // For demo purposes, we'll simulate success
      setTimeout(() => {
        actions.addProject({
          name: projectData.name,
          description: projectData.description,
          type: projectData.type,
          technology: projectData.technology,
          features: projectData.features,
          createdAt: new Date().toISOString(),
          status: 'created',
        });
        
        setIsCreating(false);
        navigate('/projects');
      }, 3000);
    } catch (error) {
      console.error('Error creating project:', error);
      setIsCreating(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Tell us about your project
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={projectData.name}
                  onChange={(e) => handleProjectDataChange('name', e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Project Description"
                  value={projectData.description}
                  onChange={(e) => handleProjectDataChange('description', e.target.value)}
                  placeholder="Describe what your project does and its main goals..."
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Choose Project Type
                </Typography>
                <Grid container spacing={2}>
                  {projectTypes.map((type) => (
                    <Grid item xs={12} sm={6} md={4} key={type.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: 2,
                          borderColor: projectData.type === type.id ? 'primary.main' : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.light',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                        onClick={() => handleProjectDataChange('type', type.id)}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {type.icon}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {type.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        const selectedProjectType = projectTypes.find(t => t.id === projectData.type);
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Configure your project
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Technology Stack</InputLabel>
                  <Select
                    value={projectData.technology}
                    onChange={(e) => handleProjectDataChange('technology', e.target.value)}
                    label="Technology Stack"
                  >
                    {selectedProjectType?.technologies.map((tech) => (
                      <MenuItem key={tech} value={tech}>
                        {tech.charAt(0).toUpperCase() + tech.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workspace Path"
                  value={projectData.workspace}
                  onChange={(e) => handleProjectDataChange('workspace', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Features to Include
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableFeatures.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      color={projectData.features.includes(feature) ? 'primary' : 'default'}
                      variant={projectData.features.includes(feature) ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  AI Configuration
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={projectData.useGrok}
                        onChange={(e) => handleProjectDataChange('useGrok', e.target.checked)}
                      />
                    }
                    label="Use Grok AI for project generation"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={projectData.useCursor}
                        onChange={(e) => handleProjectDataChange('useCursor', e.target.checked)}
                      />
                    }
                    label="Automatically open in Cursor editor"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={projectData.autoImplement}
                        onChange={(e) => handleProjectDataChange('autoImplement', e.target.checked)}
                      />
                    }
                    label="Auto-implement basic structure"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Generate AI Outline
            </Typography>
            
            {!generatedOutline && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <GrokIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Ready to generate your project outline
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Grok AI will analyze your requirements and create a detailed project outline
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<GrokIcon />}
                  onClick={generateOutline}
                  disabled={isGenerating || !connected}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Outline with Grok'}
                </Button>
                
                {isGenerating && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Grok is analyzing your requirements...
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {generatedOutline && (
              <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Generated Project Outline
                </Typography>
                <Box
                  sx={{
                    maxHeight: 400,
                    overflow: 'auto',
                    '& h1, & h2, & h3': { color: 'primary.main' },
                    '& code': {
                      bgcolor: 'grey.100',
                      p: 0.5,
                      borderRadius: 1,
                    },
                  }}
                >
                  <ReactMarkdown>{generatedOutline}</ReactMarkdown>
                </Box>
              </Paper>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review & Create Project
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Project Summary
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Project Name"
                          secondary={projectData.name}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <CodeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Technology"
                          secondary={projectData.technology}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Workspace"
                          secondary={projectData.workspace}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <BuildIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Features"
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {projectData.features.map((feature) => (
                                <Chip key={feature} label={feature} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))}
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      What happens next?
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Generate project structure"
                          secondary="Create directories and files"
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Install dependencies"
                          secondary="Set up the development environment"
                        />
                      </ListItem>
                      
                      {projectData.useCursor && (
                        <ListItem>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Open in Cursor"
                            secondary="Launch the project in Cursor editor"
                          />
                        </ListItem>
                      )}
                      
                      {projectData.autoImplement && (
                        <ListItem>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Implement basic structure"
                            secondary="Generate initial code"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return projectData.name && projectData.description && projectData.type;
      case 1:
        return projectData.technology;
      case 2:
        return generatedOutline;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isStepComplete(activeStep);
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 2,
            }}
          >
            <GrokIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Project Wizard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create amazing projects with AI assistance
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label} completed={isStepComplete(index)}>
                <StepLabel
                  StepIconComponent={({ completed, active }) => (
                    <Avatar
                      sx={{
                        bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                        color: 'white',
                        width: 32,
                        height: 32,
                      }}
                    >
                      {completed ? <CheckIcon /> : <step.icon />}
                    </Avatar>
                  )}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </Paper>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            size="large"
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<LaunchIcon />}
                onClick={createProject}
                disabled={isCreating || !connected}
                sx={{
                  background: 'linear-gradient(45deg, #48bb78 30%, #38a169 90%)',
                  px: 4,
                }}
              >
                {isCreating ? 'Creating Project...' : 'Create Project'}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={activeStep === 2 ? generateOutline : handleNext}
                disabled={!canProceed() || (activeStep === 2 && isGenerating)}
              >
                {activeStep === 2 ? 'Generate Outline' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>

        {/* Progress for creation */}
        {isCreating && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Creating your project... This may take a few moments.
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default ProjectWizard;