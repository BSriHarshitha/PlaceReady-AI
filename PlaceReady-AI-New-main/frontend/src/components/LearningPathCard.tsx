import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ExpandMore, PlayArrow, Article, VideoLibrary, Code } from '@mui/icons-material';
import { LearningPath } from '../utils/LearningPaths';

interface LearningPathCardProps {
  learningPath: LearningPath;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ learningPath }) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <PlayArrow />;
      case 'video':
        return <VideoLibrary />;
      case 'practice':
        return <Code />;
      default:
        return <Article />;
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {learningPath.skill} Learning Path
          </Typography>
          <Chip
            label={learningPath.difficulty}
            size="small"
            sx={{
              textTransform: 'capitalize',
              backgroundColor:
                learningPath.difficulty === 'beginner'
                  ? '#fef3c7'
                  : learningPath.difficulty === 'intermediate'
                  ? '#dbeafe'
                  : '#d1fae5',
              color:
                learningPath.difficulty === 'beginner'
                  ? '#b45309'
                  : learningPath.difficulty === 'intermediate'
                  ? '#1e40af'
                  : '#065f46',
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Est. {learningPath.totalEstimatedTime}
        </Typography>
      </Box>

      {learningPath.steps.map((step, index) => (
        <Accordion key={index} defaultExpanded={index === 0}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Step {step.step}: {step.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {step.estimatedTime}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {step.description}
            </Typography>
            <List dense>
              {step.resources.map((resource, resIndex) => (
                <ListItem key={resIndex} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getResourceIcon(resource.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer" underline="hover">
                        {resource.title}
                      </Link>
                    }
                    secondary={resource.type}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

