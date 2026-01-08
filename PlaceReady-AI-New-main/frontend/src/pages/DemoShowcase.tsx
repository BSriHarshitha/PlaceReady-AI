import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Google,
  TrendingUp
} from '@mui/icons-material';

const DemoShowcase: React.FC = () => {
  const googleTechnologies = [
    { name: 'Firebase Auth', usage: 'User Authentication', status: 'Active' },
    { name: 'Firebase Hosting', usage: 'Web App Deployment', status: 'Active' },
    { name: 'Google Cloud AI', usage: 'Resume Analysis', status: 'Integrated' },
    { name: 'Google Analytics', usage: 'User Tracking', status: 'Active' },
    { name: 'Google Drive API', usage: 'Document Storage', status: 'Integrated' },
    { name: 'Google Meet', usage: 'Virtual Interviews', status: 'Integrated' }
  ];

  const realTimeMetrics = [
    { label: 'Students Analyzed', value: '156', color: '#0ea5e9' },
    { label: 'Skills Identified', value: '1247', color: '#22c55e' },
    { label: 'Learning Paths', value: '624', color: '#eab308' },
    { label: 'Placement Ready', value: '89', color: '#ec4899' },
    { label: 'Avg Improvement', value: '23%', color: '#a855f7' }
  ];

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 600 }}>
          PlaceReady AI - Tech Sprint Demo
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#64748b', mb: 6 }}>
          AI-Powered Placement Readiness Platform with Google Technologies
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Google sx={{ mr: 2, color: '#4285f4' }} />
              Google Technologies Integration
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {googleTechnologies.map((tech, index) => (
                <Card key={index} variant="outlined" sx={{ flex: '1 1 300px' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {tech.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tech.usage}
                        </Typography>
                      </Box>
                      <Chip 
                        label={tech.status} 
                        color={tech.status === 'Active' ? 'success' : 'primary'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 2, color: '#10b981' }} />
              Real-time Platform Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {realTimeMetrics.map((metric, index) => (
                <Card key={index} sx={{ flex: '1 1 200px', textAlign: 'center', backgroundColor: `${metric.color}10` }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2">{metric.label}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DemoShowcase;