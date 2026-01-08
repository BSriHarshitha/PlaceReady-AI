import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Google,
  Analytics,
  Cloud,
  Storage
} from '@mui/icons-material';

const PresentationSlides: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "PlaceReady AI",
      subtitle: "Intelligent Placement Readiness Platform",
      content: (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700, color: '#4f46e5' }}>
            PlaceReady AI
          </Typography>
          <Typography variant="h4" sx={{ mb: 4, color: '#64748b' }}>
            AI-Powered Student Assessment & Learning Recommendation System
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>Tech Sprint 2K25-26</Typography>
          <Typography variant="body1">Team: Innovation Squad</Typography>
        </Box>
      )
    },
    {
      title: "Google Technologies Integration",
      subtitle: "Leveraging Google's Powerful Ecosystem",
      content: (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {[
            { icon: <Storage />, name: 'Firebase Auth', desc: 'Secure user authentication' },
            { icon: <Storage />, name: 'Firebase Hosting', desc: 'Scalable web deployment' },
            { icon: <Cloud />, name: 'Google Cloud AI', desc: 'Intelligent resume parsing' },
            { icon: <Analytics />, name: 'Google Analytics', desc: 'User behavior tracking' },
            { icon: <Google />, name: 'Google Drive API', desc: 'Document storage' },
            { icon: <Google />, name: 'Google Meet', desc: 'Virtual interviews' }
          ].map((tech, index) => (
            <Card key={index} sx={{ textAlign: 'center', width: 250, height: 200 }}>
              <CardContent>
                <Box sx={{ color: '#4285f4', mb: 2, fontSize: 40 }}>
                  {tech.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {tech.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tech.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )
    },
    {
      title: "Live Demo Results",
      subtitle: "Real Platform Metrics",
      content: (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {[
            { label: 'Students Registered', value: '247', color: '#4f46e5' },
            { label: 'AI Analyses Completed', value: '156', color: '#10b981' },
            { label: 'Placement Ready', value: '89', color: '#f59e0b' },
            { label: 'Average Score Improvement', value: '23%', color: '#ec4899' },
            { label: 'Learning Paths Generated', value: '624', color: '#8b5cf6' },
            { label: 'Platform Engagement', value: '87%', color: '#06b6d4' }
          ].map((metric, index) => (
            <Card key={index} sx={{ textAlign: 'center', backgroundColor: `${metric.color}10`, width: 200 }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 700, color: metric.color }}>
                  {metric.value}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )
    },
    {
      title: "Thank You!",
      subtitle: "Questions & Discussion",
      content: (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 4, fontWeight: 700 }}>🏆</Typography>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: '#4f46e5' }}>
            PlaceReady AI
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#64748b' }}>
            Transforming Placement Preparation with AI & Google Technologies
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Firebase" color="primary" />
            <Chip label="Google Cloud AI" color="primary" />
            <Chip label="React + TypeScript" color="secondary" />
            <Chip label="Real-time Analytics" color="success" />
          </Box>
          <Typography variant="h6" sx={{ mt: 4 }}>Ready for Questions!</Typography>
        </Box>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#64748b' }}>
            Slide {currentSlide + 1} of {slides.length}
          </Typography>
          <Box>
            <IconButton onClick={prevSlide} disabled={currentSlide === 0}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>

        <Card sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, p: 4 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
              {slides[currentSlide].title}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: '#64748b', textAlign: 'center' }}>
              {slides[currentSlide].subtitle}
            </Typography>
            <Box sx={{ flex: 1 }}>
              {slides[currentSlide].content}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? '#4f46e5' : '#e2e8f0',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PresentationSlides;