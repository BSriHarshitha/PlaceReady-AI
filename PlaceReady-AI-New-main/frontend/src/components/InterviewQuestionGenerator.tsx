import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Quiz,
  ExpandMore,
  Psychology,
  Code,
  Group,
  Timer
} from '@mui/icons-material';
import aiService, { InterviewQuestion } from '../services/aiService';

interface InterviewQuestionGeneratorProps {
  userSkills: string[];
}

const InterviewQuestionGenerator: React.FC<InterviewQuestionGeneratorProps> = ({
  userSkills
}) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
    'Software Engineer'
  ];

  const generateQuestions = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      const generatedQuestions = await aiService.generateInterviewQuestions(selectedRole, userSkills);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return <Code />;
      case 'behavioral': return <Psychology />;
      case 'situational': return <Group />;
      default: return <Quiz />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const handleQuestionClick = (question: InterviewQuestion) => {
    setCurrentQuestion(question);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Quiz color="primary" />
        AI Interview Question Generator
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
                onClick={generateQuestions}
                disabled={!selectedRole || loading}
                fullWidth
                startIcon={<Quiz />}
              >
                Generate Questions
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generating Interview Questions...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {questions.map((question, index) => (
          <Box key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => handleQuestionClick(question)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(question.type)}
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      Question {index + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={question.type} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={question.difficulty} 
                      size="small" 
                      color={getDifficultyColor(question.difficulty) as any}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {question.question}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Timer />}
                >
                  Practice Answer
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {currentQuestion && getTypeIcon(currentQuestion.type)}
            Interview Question Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentQuestion && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {currentQuestion.question}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip label={currentQuestion.type} variant="outlined" />
                <Chip 
                  label={currentQuestion.difficulty} 
                  color={getDifficultyColor(currentQuestion.difficulty) as any}
                />
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">Expected Answer</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {currentQuestion.expectedAnswer}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Answer"
                placeholder="Practice your answer here..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained">Save Answer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewQuestionGenerator;