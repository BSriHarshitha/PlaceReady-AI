import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Code,
  School,
  Assignment,
  CheckCircle,
  Upload,
  Person,
  Email,
  BusinessCenter,
  CalendarToday
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      const savedAnalysis = localStorage.getItem(`analysis_${currentUser.uid}`);
      if (savedAnalysis) {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        setAnalysis(parsedAnalysis);
        setHasAnalysis(true);
      }
    }
  }, [currentUser]);

  const readinessData = {
    labels: ['Ready', 'Needs Work'],
    datasets: [{
      data: hasAnalysis ? [analysis?.finalScore || 0, 100 - (analysis?.finalScore || 0)] : [0, 100],
      backgroundColor: ['#4f46e5', '#e2e8f0'],
      borderWidth: 0
    }]
  };

  const skills = hasAnalysis ? [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 70 },
    { name: 'Python', level: 75 },
    { name: 'SQL', level: 65 },
    { name: 'System Design', level: 40 }
  ] : [];

  if (!hasAnalysis) {
    return (
      <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Welcome back, {userProfile?.name || 'Student'}!
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
            Complete your profile analysis to get started
          </Typography>

          {/* Student Profile Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Your Profile
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#64748b' }} />
                  <Typography variant="body1">{userProfile?.name || 'Not provided'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#64748b' }} />
                  <Typography variant="body1">{userProfile?.email || 'Not provided'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ color: '#64748b' }} />
                  <Typography variant="body1">{userProfile?.college || 'Not provided'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessCenter sx={{ color: '#64748b' }} />
                  <Typography variant="body1">{userProfile?.branch || 'Not provided'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: '#64748b' }} />
                  <Typography variant="body1">{userProfile?.year || 'Not provided'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Analysis Required Alert */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Complete Your Placement Readiness Analysis
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              To view your dashboard and get personalized recommendations, please upload your resume and coding profiles for AI analysis.
            </Typography>
          </Alert>

          {/* Action Cards */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Upload sx={{ fontSize: 60, color: '#4f46e5', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Resume & Profiles
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                  Upload your resume and add your coding profiles to get AI-powered analysis
                </Typography>
                <Button 
                  component={Link}
                  to="/skill-analysis"
                  variant="contained"
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                    px: 4
                  }}
                >
                  Start Analysis
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  What You'll Get:
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText primary="Placement Readiness Score (0-100)" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText primary="Skill Gap Analysis" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText primary="Personalized Recommendations" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText primary="Progress Tracking" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Welcome back, {userProfile?.name || 'Student'}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
          Track your placement readiness and skill development progress
        </Typography>

        {/* Student Profile Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              Your Profile
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ color: '#64748b' }} />
                <Typography variant="body1">{userProfile?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#64748b' }} />
                <Typography variant="body1">{userProfile?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School sx={{ color: '#64748b' }} />
                <Typography variant="body1">{userProfile?.college || 'Not provided'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessCenter sx={{ color: '#64748b' }} />
                <Typography variant="body1">{userProfile?.branch || 'Not provided'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ color: '#64748b' }} />
                <Typography variant="body1">{userProfile?.year || 'Not provided'}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Readiness Score */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ width: 300 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Placement Readiness
              </Typography>
              <Box sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}>
                <Doughnut 
                  data={readinessData}
                  options={{
                    cutout: '70%',
                    plugins: { legend: { display: false } }
                  }}
                />
                <Box sx={{ position: 'relative', top: -130, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                    {analysis?.finalScore || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready
                  </Typography>
                </Box>
              </Box>
              <Chip label="Analysis Complete" color="success" sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Based on your resume and coding profiles
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Card sx={{ width: 150 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Code sx={{ fontSize: 40, color: '#4f46e5', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{analysis?.codingScore || 0}%</Typography>
                <Typography variant="body2" color="text.secondary">Coding Score</Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: 150 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <School sx={{ fontSize: 40, color: '#06b6d4', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{analysis?.skills?.length || 0}</Typography>
                <Typography variant="body2" color="text.secondary">Skills Found</Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: 150 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{analysis?.resumeScore || 0}%</Typography>
                <Typography variant="body2" color="text.secondary">Resume Score</Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: 150 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{analysis?.skillGaps?.length || 0}</Typography>
                <Typography variant="body2" color="text.secondary">Skill Gaps</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Skills and Recommendations */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Identified Skills
              </Typography>
              <Box sx={{ mb: 3 }}>
                {analysis?.skills?.map((skill: string, index: number) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    color="primary" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Skill Gaps
              </Typography>
              <Box>
                {analysis?.skillGaps?.map((gap: string, index: number) => (
                  <Chip 
                    key={index} 
                    label={gap} 
                    color="warning" 
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Personalized Recommendations
              </Typography>
              <List>
                {analysis?.recommendations?.map((rec: string, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#4f46e5' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={rec}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button 
                component={Link}
                to="/skill-analysis"
                variant="outlined" 
                fullWidth
                sx={{ mt: 2 }}
              >
                Re-analyze Profile
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentDashboard;