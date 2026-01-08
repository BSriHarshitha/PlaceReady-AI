import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  Code,
  Psychology,
  Business,
  School,
  Quiz,
  VideoLibrary,
  Article,
  CheckCircle,
  PlayArrow,
  MenuBook,
  TrendingUp
} from '@mui/icons-material';

const Learn: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      const results = localStorage.getItem(`analysis_${currentUser.uid}`);
      if (results) {
        setAnalysisResults(JSON.parse(results));
      }
    }
  }, [currentUser]);

  const learningPaths = [
    {
      title: 'Data Structures & Algorithms',
      icon: <Code />,
      level: 'Beginner to Advanced',
      duration: '8-12 weeks',
      topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching'],
      progress: 65,
      color: '#4f46e5',
      learningLinks: [
        'https://leetcode.com/tag/array/',
        'https://www.geeksforgeeks.org/data-structures/',
        'https://www.coursera.org/specializations/algorithms',
        'https://www.youtube.com/playlist?list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma'
      ]
    },
    {
      title: 'System Design',
      icon: <Psychology />,
      level: 'Intermediate',
      duration: '6-8 weeks',
      topics: ['Scalability', 'Load Balancing', 'Database Design', 'Microservices', 'Caching'],
      progress: 30,
      color: '#06b6d4',
      learningLinks: [
        'https://github.com/donnemartin/system-design-primer',
        'http://highscalability.com/',
        'https://www.educative.io/courses/grokking-the-system-design-interview',
        'https://www.youtube.com/c/SystemDesignInterview'
      ]
    },
    {
      title: 'Web Development',
      icon: <School />,
      level: 'Beginner to Advanced',
      duration: '10-14 weeks',
      topics: ['HTML/CSS', 'JavaScript', 'React/Angular', 'Node.js', 'Databases'],
      progress: 80,
      color: '#10b981',
      learningLinks: [
        'https://developer.mozilla.org/en-US/',
        'https://www.freecodecamp.org/',
        'https://react.dev/',
        'https://nodejs.org/en/learn/'
      ]
    },
    {
      title: 'Aptitude & Reasoning',
      icon: <Quiz />,
      level: 'All Levels',
      duration: '4-6 weeks',
      topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
      progress: 45,
      color: '#f59e0b',
      learningLinks: [
        'https://www.indiabix.com/aptitude/questions-and-answers/',
        'https://prepinsta.com/aptitude/',
        'https://www.khanacademy.org/math',
        'https://testbook.com/reasoning'
      ]
    }
  ];

  const practiceResources = [
    {
      category: 'Coding Practice',
      resources: [
        { name: 'LeetCode', description: 'Algorithm and data structure problems', link: 'https://leetcode.com', type: 'Practice' },
        { name: 'HackerRank', description: 'Programming challenges and contests', link: 'https://hackerrank.com', type: 'Practice' },
        { name: 'CodeChef', description: 'Competitive programming platform', link: 'https://codechef.com', type: 'Practice' },
        { name: 'GeeksforGeeks', description: 'Programming tutorials and practice', link: 'https://geeksforgeeks.org', type: 'Tutorial' }
      ]
    },
    {
      category: 'System Design',
      resources: [
        { name: 'System Design Primer', description: 'Comprehensive system design guide', link: 'https://github.com/donnemartin/system-design-primer', type: 'Tutorial' },
        { name: 'High Scalability', description: 'Real-world system architectures', link: 'http://highscalability.com', type: 'Article' },
        { name: 'Designing Data-Intensive Applications', description: 'Book on system design', link: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321', type: 'Book' },
        { name: 'System Design Interview', description: 'Interview preparation guide', link: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', type: 'Book' }
      ]
    },
    {
      category: 'Aptitude & Reasoning',
      resources: [
        { name: 'IndiaBIX', description: 'Aptitude questions and answers', link: 'https://indiabix.com', type: 'Practice' },
        { name: 'PrepInsta', description: 'Placement preparation platform', link: 'https://prepinsta.com', type: 'Practice' },
        { name: 'Quantitative Aptitude by R.S. Aggarwal', description: 'Comprehensive aptitude book', link: 'https://www.amazon.com/Quantitative-Aptitude-Competitive-Examinations-Aggarwal/dp/8121924154', type: 'Book' },
        { name: 'Logical Reasoning by Arun Sharma', description: 'Reasoning preparation book', link: 'https://www.amazon.com/How-Prepare-Logical-Reasoning-CAT/dp/0070702446', type: 'Book' }
      ]
    }
  ];

  const interviewTips = [
    {
      title: 'Technical Interview Preparation',
      tips: [
        'Practice coding problems daily (at least 2-3 problems)',
        'Understand time and space complexity',
        'Learn to explain your thought process clearly',
        'Practice on whiteboard or paper',
        'Review fundamental concepts regularly'
      ]
    },
    {
      title: 'HR Interview Tips',
      tips: [
        'Research the company thoroughly',
        'Prepare your introduction (Tell me about yourself)',
        'Have examples ready for behavioral questions',
        'Prepare thoughtful questions about the role',
        'Practice confident body language'
      ]
    },
    {
      title: 'System Design Interview',
      tips: [
        'Start with requirements gathering',
        'Think about scalability from the beginning',
        'Discuss trade-offs openly',
        'Draw diagrams to explain your design',
        'Consider real-world constraints'
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Practice': return <Code sx={{ color: '#4f46e5' }} />;
      case 'Tutorial': return <VideoLibrary sx={{ color: '#06b6d4' }} />;
      case 'Article': return <Article sx={{ color: '#10b981' }} />;
      case 'Book': return <MenuBook sx={{ color: '#f59e0b' }} />;
      default: return <School sx={{ color: '#64748b' }} />;
    }
  };

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {currentUser && analysisResults ? `Welcome back, ${currentUser.displayName || 'Student'}!` : 'Learn & Prepare'}
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
            {currentUser && analysisResults 
              ? 'Continue your personalized learning journey based on your skill analysis'
              : 'Comprehensive placement preparation resources to boost your readiness score'
            }
          </Typography>
        </Box>

        <Tabs 
          value={selectedTab} 
          onChange={(_, newValue) => setSelectedTab(newValue)}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Learning Paths" />
          <Tab label="Practice Resources" />
          <Tab label="Interview Tips" />
        </Tabs>

        {/* Learning Paths Tab */}
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              {currentUser && analysisResults ? 'Your Personalized Learning Paths' : 'Structured Learning Paths'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              {learningPaths.map((path, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    width: 350,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 20px -5px rgb(0 0 0 / 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: path.color, mr: 2, '& svg': { fontSize: 32 } }}>
                        {path.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {path.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {path.level} • {path.duration}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Progress: {path.progress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={path.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: path.color
                          }
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Key Topics:
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {path.topics.map((topic, idx) => (
                        <Chip 
                          key={idx}
                          label={topic}
                          size="small"
                          sx={{ 
                            mr: 1, 
                            mb: 1,
                            backgroundColor: `${path.color}20`,
                            color: path.color
                          }}
                        />
                      ))}
                    </Box>

                    <Button 
                      variant="contained"
                      fullWidth
                      startIcon={<PlayArrow />}
                      onClick={() => {
                        path.learningLinks.forEach(link => {
                          window.open(link, '_blank');
                        });
                      }}
                      sx={{ 
                        backgroundColor: path.color,
                        '&:hover': {
                          backgroundColor: path.color,
                          opacity: 0.9
                        }
                      }}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Practice Resources Tab */}
        {selectedTab === 1 && (
          <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Practice Resources
            </Typography>
            {practiceResources.map((category, index) => (
              <Card key={index} sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#4f46e5' }}>
                    {category.category}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {category.resources.map((resource, idx) => (
                      <Paper 
                        key={idx}
                        sx={{ 
                          p: 3, 
                          flex: '1 1 300px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          {getTypeIcon(resource.type)}
                          <Box sx={{ ml: 2, flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {resource.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {resource.description}
                            </Typography>
                            <Chip label={resource.type} size="small" color="primary" />
                          </Box>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<TrendingUp />}
                          sx={{ mt: 1 }}
                          onClick={() => window.open(resource.link, '_blank')}
                        >
                          Start Practice
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Interview Tips Tab */}
        {selectedTab === 2 && (
          <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Interview Preparation Tips
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              {interviewTips.map((section, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    width: 400,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 20px -5px rgb(0 0 0 / 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#4f46e5' }}>
                      {section.title}
                    </Typography>
                    <List>
                      {section.tips.map((tip, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={tip}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Call to Action */}
        <Paper 
          elevation={3}
          sx={{ 
            mt: 6,
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {currentUser && analysisResults 
              ? 'Want to Update Your Skills Assessment?'
              : 'Ready to Test Your Skills?'
            }
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {currentUser && analysisResults 
              ? 'Retake your skill analysis to get updated learning recommendations'
              : 'Complete your skill analysis to get personalized learning recommendations'
            }
          </Typography>
          <Button 
            variant="contained"
            size="large"
            onClick={() => navigate('/skill-analysis')}
            sx={{ 
              backgroundColor: 'white',
              color: currentUser && analysisResults ? '#10b981' : '#4f46e5',
              px: 4,
              '&:hover': {
                backgroundColor: '#f8fafc'
              }
            }}
          >
            {currentUser && analysisResults ? 'Update Analysis' : 'Analyze My Skills'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Learn;