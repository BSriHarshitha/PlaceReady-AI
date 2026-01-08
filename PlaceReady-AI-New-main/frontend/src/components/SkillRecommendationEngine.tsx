import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  TrendingUp,
  School,
  ExpandMore,
  Star,
  BookmarkBorder
} from '@mui/icons-material';
import aiService, { SkillRecommendation, ResumeAnalysis } from '../services/aiService';

interface SkillRecommendationEngineProps {
  currentSkills: string[];
  targetRole: string;
  resumeAnalysis?: ResumeAnalysis | null;
}

const SkillRecommendationEngine: React.FC<SkillRecommendationEngineProps> = ({
  currentSkills,
  targetRole,
  resumeAnalysis
}) => {
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSkills.length > 0 && targetRole) {
      generateRecommendations();
    }
  }, [currentSkills, targetRole, resumeAnalysis]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await aiService.generateSkillRecommendations(currentSkills, targetRole, resumeAnalysis);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generating Skill Recommendations...
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Typography variant="h5" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mb: 3,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <TrendingUp sx={{ fontSize: 32 }} />
        AI Skill Recommendations
        <Chip label="BETA" size="small" sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Typography>

      <Alert severity="info" sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
        border: '1px solid #0288d1',
        borderRadius: 2
      }}>
        🎯 Based on your current skills and target role: <strong>{targetRole}</strong>
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recommendations.map((rec, index) => (
          <Box key={index} sx={{ flex: { md: '0 0 48%' } }}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#06b6d4'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📚 {rec.skill}
                  </Typography>
                  <Chip 
                    label={rec.priority.toUpperCase()} 
                    color={getPriorityColor(rec.priority) as any}
                    size="small"
                    icon={<Star />}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  💡 {rec.reason}
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Learning Resources</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {rec.resources.map((resource, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <School fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={resource} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Button
                  variant="contained"
                  startIcon={<BookmarkBorder />}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    fontWeight: 600,
                    py: 1.5
                  }}
                >
                  Add to Learning Plan
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center', p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: 2 }}>
        <Button
          variant="contained"
          onClick={generateRecommendations}
          disabled={loading}
          size="large"
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            fontWeight: 600,
            px: 4,
            py: 1.5
          }}
        >
          🔄 Refresh Recommendations
        </Button>
      </Box>
    </Box>
  );
};

export default SkillRecommendationEngine;