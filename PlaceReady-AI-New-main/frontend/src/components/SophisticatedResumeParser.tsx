import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Description,
  ExpandMore,
  Star,
  TrendingUp,
  TrendingDown,
  School,
  Work,
  Assignment,
  Verified
} from '@mui/icons-material';
import aiService, { ResumeAnalysis } from '../services/aiService';

interface SophisticatedResumeParserProps {
  onAnalysisComplete?: (analysis: ResumeAnalysis) => void;
}

const SophisticatedResumeParser: React.FC<SophisticatedResumeParserProps> = ({ onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      const result = await aiService.parseResume(text);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Description color="primary" />
        AI Resume Analysis
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PDF, DOC, DOCX, and TXT files
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analyzing your resume with AI...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {analysis && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { md: '0 0 33%' } }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Overall Score
                  </Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={analysis.score}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        width: 200,
                        bgcolor: 'grey.200'
                      }}
                      color={getScoreColor(analysis.score) as any}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" component="div" color="text.secondary">
                        {analysis.score}/100
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color={`${getScoreColor(analysis.score)}.main`}>
                    {getScoreLabel(analysis.score)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Work color="primary" />
                      <Typography variant="body2">
                        Experience: {analysis.experience} years
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <School color="primary" />
                      <Typography variant="body2">
                        Education: {analysis.education.length} qualifications
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assignment color="primary" />
                      <Typography variant="body2">
                        Projects: {analysis.projects.length}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Verified color="primary" />
                      <Typography variant="body2">
                        Certifications: {analysis.certifications.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Technical Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp color="success" />
                        <Typography variant="h6">Strengths</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysis.strengths.map((strength, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Star color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={strength} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingDown color="error" />
                        <Typography variant="h6">Areas for Improvement</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysis.weaknesses.map((weakness, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <TrendingDown color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={weakness} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Projects
                    </Typography>
                    <List dense>
                      {analysis.projects.map((project, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Assignment color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={project} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Certifications
                    </Typography>
                    <List dense>
                      {analysis.certifications.map((cert, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Verified color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={cert} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SophisticatedResumeParser;