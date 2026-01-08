import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Quiz,
  School,
  Description,
  AutoAwesome,
  Speed,
  Security,
  Analytics,
  Lightbulb,
  Rocket,
  Star,
  CheckCircle
} from '@mui/icons-material';
import SophisticatedResumeParser from '../components/SophisticatedResumeParser';
import SkillRecommendationEngine from '../components/SkillRecommendationEngine';
import InterviewQuestionGenerator from '../components/InterviewQuestionGenerator';
import PersonalizedLearningPaths from '../components/PersonalizedLearningPaths';
import { ResumeAnalysis } from '../services/aiService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AIFeatures: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [userSkills, setUserSkills] = useState(['JavaScript', 'React', 'Node.js', 'Python']);
  const [targetRole] = useState('Full Stack Developer');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleResumeAnalysis = (analysis: ResumeAnalysis) => {
    setResumeAnalysis(analysis);
    setUserSkills(analysis.skills);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const features = [
    {
      title: 'AI Resume Analysis',
      description: 'Advanced resume parsing with skill extraction and scoring',
      icon: <Description />,
      color: '#4f46e5',
      stats: '95% Accuracy',
      badge: 'NEW'
    },
    {
      title: 'Skill Recommendations',
      description: 'Personalized skill suggestions based on career goals',
      icon: <TrendingUp />,
      color: '#06b6d4',
      stats: '50+ Skills',
      badge: 'HOT'
    },
    {
      title: 'Interview Questions',
      description: 'AI-generated interview questions for practice',
      icon: <Quiz />,
      color: '#10b981',
      stats: '1000+ Questions',
      badge: 'POPULAR'
    },
    {
      title: 'Learning Paths',
      description: 'Customized learning roadmaps for career advancement',
      icon: <School />,
      color: '#f59e0b',
      stats: '20+ Paths',
      badge: 'TRENDING'
    }
  ];

  const aiCapabilities = [
    { icon: <Speed />, title: 'Real-time Analysis', desc: 'Instant AI processing' },
    { icon: <Security />, title: 'Secure Processing', desc: 'Privacy-first approach' },
    { icon: <Analytics />, title: 'Deep Insights', desc: 'Advanced analytics' },
    { icon: <AutoAwesome />, title: 'Smart Recommendations', desc: 'Personalized suggestions' }
  ];

  const stats = [
    { label: 'Resumes Analyzed', value: '10,000+', icon: <Description /> },
    { label: 'Skills Identified', value: '500+', icon: <TrendingUp /> },
    { label: 'Questions Generated', value: '50,000+', icon: <Quiz /> },
    { label: 'Learning Paths', value: '100+', icon: <School /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3, py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 3, color: 'white' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            🚀 AI-Powered Features
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Leverage advanced AI to accelerate your placement preparation
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip icon={<Rocket />} label="Powered by OpenAI" color="secondary" />
            <Chip icon={<Star />} label="95% Accuracy" color="secondary" />
            <Chip icon={<CheckCircle />} label="Real-time Analysis" color="secondary" />
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ flex: { xs: '0 0 48%', md: '0 0 23%' } }}>
              <Card sx={{ textAlign: 'center', py: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent sx={{ py: 1 }}>
                  <Box sx={{ color: 'white', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  <Typography variant="caption">{stat.label}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology /> AI Capabilities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {aiCapabilities.map((cap, index) => (
                <Box key={index} sx={{ flex: { xs: '0 0 48%', md: '0 0 23%' } }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 1 }}>
                      {cap.icon}
                    </Avatar>
                    <Typography variant="subtitle2">{cap.title}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>{cap.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '0 0 48%', md: '0 0 23%' } }}>
              <Badge badgeContent={feature.badge} color="error" sx={{ width: '100%' }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.color
                    }
                  }}
                  onClick={() => setTabValue(index)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: feature.color, 
                        width: 56, 
                        height: 56, 
                        mx: 'auto', 
                        mb: 2,
                        '& svg': { fontSize: 28 }
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {feature.description}
                    </Typography>
                    <Chip 
                      label={feature.stats} 
                      size="small" 
                      sx={{ 
                        bgcolor: feature.color + '20', 
                        color: feature.color,
                        fontWeight: 600
                      }} 
                    />
                  </CardContent>
                </Card>
              </Badge>
            </Box>
          ))}
        </Box>

        <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="AI features tabs"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  minHeight: 72,
                  '&.Mui-selected': {
                    color: '#4f46e5'
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
                }
              }}
            >
              <Tab 
                icon={<Description />} 
                label="Resume Analysis" 
                id="ai-tab-0"
                aria-controls="ai-tabpanel-0"
              />
              <Tab 
                icon={<TrendingUp />} 
                label="Skill Recommendations" 
                id="ai-tab-1"
                aria-controls="ai-tabpanel-1"
              />
              <Tab 
                icon={<Quiz />} 
                label="Interview Questions" 
                id="ai-tab-2"
                aria-controls="ai-tabpanel-2"
              />
              <Tab 
                icon={<School />} 
                label="Learning Paths" 
                id="ai-tab-3"
                aria-controls="ai-tabpanel-3"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', p: 3, borderRadius: 2 }}>
              <SophisticatedResumeParser onAnalysisComplete={handleResumeAnalysis} />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)', p: 3, borderRadius: 2 }}>
              <SkillRecommendationEngine 
                currentSkills={userSkills}
                targetRole={targetRole}
                resumeAnalysis={resumeAnalysis}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', p: 3, borderRadius: 2 }}>
              <InterviewQuestionGenerator 
                userSkills={userSkills}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', p: 3, borderRadius: 2 }}>
              <PersonalizedLearningPaths 
                currentSkills={userSkills}
                targetRole={targetRole}
              />
            </Box>
          </TabPanel>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
          <Box sx={{ flex: { md: '0 0 66%' } }}>
            <Card sx={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Psychology sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Powered by Advanced AI
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Next-generation machine learning algorithms
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
                  Our AI features use OpenAI's GPT models combined with machine learning algorithms 
                  to provide personalized insights and recommendations for your career growth.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      🚀 Technologies Used:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      • OpenAI GPT-3.5/4 for natural language processing<br/>
                      • TensorFlow.js for client-side ML<br/>
                      • Custom algorithms for skill matching<br/>
                      • Real-time data analysis
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      ⭐ Key Benefits:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      • Personalized career guidance<br/>
                      • Real-time skill gap analysis<br/>
                      • Industry-specific recommendations<br/>
                      • Continuous learning optimization
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Card sx={{ textAlign: 'center', py: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                <CardContent>
                  <Lightbulb sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Smart Analysis</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>AI-powered insights</Typography>
                </CardContent>
              </Card>
              <Card sx={{ textAlign: 'center', py: 3, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                <CardContent>
                  <Rocket sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Fast Processing</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Instant results</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AIFeatures;