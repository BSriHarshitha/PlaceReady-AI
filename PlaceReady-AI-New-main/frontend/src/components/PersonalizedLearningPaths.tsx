import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  School,
  AccessTime,
  CheckCircle,
  PlayArrow,
  MenuBook,
  TrendingUp,
  Assignment
} from '@mui/icons-material';
import aiService, { LearningPath } from '../services/aiService';

interface PersonalizedLearningPathsProps {
  currentSkills: string[];
  targetRole: string;
}

const PersonalizedLearningPaths: React.FC<PersonalizedLearningPathsProps> = ({
  currentSkills,
  targetRole
}) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(targetRole || '');

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Machine Learning Engineer'
  ];

  useEffect(() => {
    if (currentSkills.length > 0 && selectedRole) {
      generateLearningPath();
    }
  }, [currentSkills, selectedRole]);

  const generateLearningPath = async () => {
    setLoading(true);
    try {
      const path = await aiService.createLearningPath(currentSkills, selectedRole);
      setLearningPath(path);
    } catch (error) {
      console.error('Error generating learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = (moduleIndex: number) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(moduleIndex);
    setCompletedModules(newCompleted);
    
    if (moduleIndex === activeStep && moduleIndex < (learningPath?.modules.length || 0) - 1) {
      setActiveStep(moduleIndex + 1);
    }
  };

  const calculateProgress = () => {
    if (!learningPath) return 0;
    return (completedModules.size / learningPath.modules.length) * 100;
  };

  const getTotalHours = () => {
    if (!learningPath) return 0;
    return learningPath.modules.reduce((total, module) => total + module.estimatedHours, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Creating Your Personalized Learning Path...
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <School color="primary" />
        Personalized Learning Paths
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Target Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  label="Target Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                onClick={generateLearningPath}
                disabled={!selectedRole || loading}
                fullWidth
                startIcon={<TrendingUp />}
              >
                Generate Learning Path
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {learningPath && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {learningPath.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="primary" />
                  <Typography variant="body2">
                    Duration: {learningPath.duration}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment color="primary" />
                  <Typography variant="body2">
                    Total Hours: {getTotalHours()}h
                  </Typography>
                </Box>
                <Box>
                  <Chip 
                    label={learningPath.difficulty} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progress: {Math.round(calculateProgress())}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Modules
              </Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {learningPath.modules.map((module, index) => (
                  <Step key={index} completed={completedModules.has(index)}>
                    <StepLabel
                      optional={
                        <Typography variant="caption">
                          {module.estimatedHours} hours
                        </Typography>
                      }
                    >
                      {module.name}
                    </StepLabel>
                    <StepContent>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Topics to Cover:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {module.topics.map((topic, topicIndex) => (
                              <Chip 
                                key={topicIndex}
                                label={topic}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>

                          <Typography variant="subtitle2" gutterBottom>
                            Recommended Resources:
                          </Typography>
                          <List dense>
                            {module.resources.map((resource, resourceIndex) => (
                              <ListItem key={resourceIndex}>
                                <ListItemIcon>
                                  <MenuBook fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={resource} />
                              </ListItem>
                            ))}
                          </List>

                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              startIcon={<PlayArrow />}
                              size="small"
                            >
                              Start Module
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<CheckCircle />}
                              size="small"
                              onClick={() => handleModuleComplete(index)}
                              disabled={completedModules.has(index)}
                            >
                              {completedModules.has(index) ? 'Completed' : 'Mark Complete'}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          <Typography>
            You've completed your learning path! Ready to take on new challenges?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained">Generate New Path</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalizedLearningPaths;