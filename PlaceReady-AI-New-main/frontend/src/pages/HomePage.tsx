import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Paper
} from '@mui/material';
import {
  Psychology,
  Code,
  LinkedIn,
  Assessment,
  TrendingUp,
  School
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ pt: 10 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Know Your Placement Readiness Before Companies Do
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
            AI-powered analysis of your resume, coding skills, and professional profile 
            to predict placement success and identify skill gaps.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              component={Link}
              to="/skill-analysis"
              variant="contained" 
              size="large"
              sx={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                px: 4,
                py: 1.5
              }}
            >
              Upload Resume
            </Button>
            <Button 
              component={Link}
              to="/skill-analysis"
              variant="outlined" 
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Check Readiness
            </Button>
          </Box>
        </Box>

        {/* Sample Dashboard */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: 3,
            textAlign: 'center',
            mb: 8
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Sample Analytics Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
            <Chip label="Readiness: 78%" color="primary" />
            <Chip label="Java Expert" color="success" />
            <Chip label="DSA Strong" color="info" />
          </Box>
          <Box sx={{ height: 120, background: '#e2e8f0', borderRadius: 2, mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Real-time skill analysis and placement prediction
          </Typography>
        </Paper>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Powerful Features
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ color: '#64748b', mb: 6 }}
          >
            Everything you need to assess and improve your placement readiness
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {[
              { icon: <Psychology />, title: 'AI Resume Analysis', desc: 'Advanced NLP-powered resume parsing and skill extraction' },
              { icon: <Code />, title: 'Coding Profile Evaluation', desc: 'Analyze your competitive programming performance' },
              { icon: <LinkedIn />, title: 'LinkedIn Skill Insights', desc: 'Extract professional skills and experience data' },
              { icon: <Assessment />, title: 'Placement Readiness Score', desc: 'Get your comprehensive readiness percentage' },
              { icon: <TrendingUp />, title: 'Skill Gap Identification', desc: 'Identify areas that need improvement' },
              { icon: <School />, title: 'Personalized Preparation Plan', desc: 'AI-generated roadmap for placement success' }
            ].map((feature, index) => (
              <Card 
                key={index}
                sx={{ 
                  width: 300,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box 
                    sx={{ 
                      color: '#4f46e5', 
                      mb: 2,
                      '& svg': { fontSize: 40 }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#4f46e5', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ color: 'white', mb: 2, fontWeight: 600 }}
            >
              Ready to Analyze Your Placement Readiness?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ color: '#c7d2fe', mb: 4 }}
            >
              Get started with our AI-powered analysis in just 2 minutes
            </Typography>
            <Button 
              component={Link}
              to="/skill-analysis"
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: 'white',
                color: '#4f46e5',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Start Analysis Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;