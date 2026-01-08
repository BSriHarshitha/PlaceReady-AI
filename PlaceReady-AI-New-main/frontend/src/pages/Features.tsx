import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  Psychology,
  Code,
  LinkedIn,
  Assessment,
  TrendingUp,
  School,
  BarChart,
  Group,
  Security,
  Speed
} from '@mui/icons-material';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Psychology />,
      title: 'AI Resume Analysis',
      description: 'Advanced NLP-powered resume parsing and skill extraction with context-based weighting',
      details: ['PDF text extraction', 'Skill keyword detection', 'Experience quantification', 'Project analysis']
    },
    {
      icon: <Code />,
      title: 'Coding Profile Evaluation',
      description: 'Comprehensive analysis of competitive programming performance across platforms',
      details: ['LeetCode integration', 'CodeChef analysis', 'Codeforces tracking', 'GitHub contribution analysis']
    },
    {
      icon: <LinkedIn />,
      title: 'LinkedIn Skill Insights',
      description: 'Extract professional skills and experience data from LinkedIn profiles',
      details: ['Professional summary analysis', 'Leadership detection', 'Experience parsing', 'Skill validation']
    },
    {
      icon: <Assessment />,
      title: 'Placement Readiness Score',
      description: 'Get your comprehensive readiness percentage with detailed breakdown',
      details: ['0-100 scoring system', 'Multi-factor analysis', 'Weighted scoring', 'Progress tracking']
    },
    {
      icon: <TrendingUp />,
      title: 'Skill Gap Identification',
      description: 'Identify areas that need improvement with actionable insights',
      details: ['Gap analysis', 'Priority ranking', 'Improvement suggestions', 'Learning roadmap']
    },
    {
      icon: <School />,
      title: 'Personalized Preparation Plan',
      description: 'AI-generated roadmap for placement success tailored to your profile',
      details: ['Custom learning path', 'Resource recommendations', 'Timeline planning', 'Progress milestones']
    },
    {
      icon: <BarChart />,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with detailed performance metrics',
      details: ['Progress visualization', 'Trend analysis', 'Comparative metrics', 'Performance insights']
    },
    {
      icon: <Group />,
      title: 'Batch Management',
      description: 'Tools for placement officers to manage and analyze student batches',
      details: ['Batch analytics', 'Performance comparison', 'Training recommendations', 'Report generation']
    },
    {
      icon: <Security />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with ethical data handling practices',
      details: ['Firebase authentication', 'Encrypted data storage', 'Privacy compliance', 'Secure API calls']
    },
    {
      icon: <Speed />,
      title: 'Real-time Processing',
      description: 'Fast AI-powered analysis with instant results and recommendations',
      details: ['Quick analysis', 'Real-time updates', 'Instant feedback', 'Live progress tracking']
    }
  ];

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Powerful Features
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ color: '#64748b', mb: 4, maxWidth: 800, mx: 'auto' }}
          >
            Everything you need to assess and improve your placement readiness with AI-powered insights
          </Typography>
        </Box>

        {/* AI Analysis Formula */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 6,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: 'white',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            AI Readiness Formula
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Final Score = (Resume Score × 0.4) + (Coding Profile Score × 0.4) + (LinkedIn Score × 0.2)
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Normalized to 0–100 scale with explainable AI decisions
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Card 
              key={index}
              sx={{ 
                width: 350,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box 
                  sx={{ 
                    color: '#4f46e5', 
                    mb: 3,
                    '& svg': { fontSize: 48 }
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
                  {feature.description}
                </Typography>
                <Box>
                  {feature.details.map((detail, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          backgroundColor: '#4f46e5',
                          mr: 2
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {detail}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Technology Stack */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
            Built with Modern Technology
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {[
              'React.js', 'TypeScript', 'Material-UI', 'Firebase', 'TensorFlow.js', 
              'Chart.js', 'NLP Processing', 'Cloud Functions', 'Real-time Database'
            ].map((tech, index) => (
              <Paper 
                key={index}
                sx={{ 
                  px: 3, 
                  py: 1, 
                  backgroundColor: '#e0e7ff',
                  color: '#4f46e5',
                  fontWeight: 600
                }}
              >
                {tech}
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;