import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { generateRoadmap } from '../utils/RoadmapGenerator';

interface RoadmapViewerProps {
  skillGaps: string[];
  currentScore: number;
  targetScore: number;
}

export const RoadmapViewer: React.FC<RoadmapViewerProps> = ({
  skillGaps,
  currentScore,
  targetScore,
}) => {
  const [duration, setDuration] = useState<3 | 6 | 12>(6);
  const roadmap = generateRoadmap(skillGaps, currentScore, targetScore, duration);

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Improvement Roadmap
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant={duration === 3 ? 'contained' : 'outlined'}
            onClick={() => setDuration(3)}
          >
            3 Months
          </Button>
          <Button
            size="small"
            variant={duration === 6 ? 'contained' : 'outlined'}
            onClick={() => setDuration(6)}
          >
            6 Months
          </Button>
          <Button
            size="small"
            variant={duration === 12 ? 'contained' : 'outlined'}
            onClick={() => setDuration(12)}
          >
            12 Months
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f9ff', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Goal: Improve from {currentScore}% to {targetScore}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Focus Areas: {roadmap.focusAreas.join(', ')}
        </Typography>
      </Box>

      <Timeline position="alternate">
        {roadmap.milestones.map((milestone, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" variant="outlined">
                {index + 1}
              </TimelineDot>
              {index < roadmap.milestones.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Month {milestone.month}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#64748b' }}>
                    {milestone.title}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Goals:
                    </Typography>
                    {milestone.goals.map((goal, goalIndex) => (
                      <Chip
                        key={goalIndex}
                        label={goal}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {milestone.skills.map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Metrics:
                    </Typography>
                    {milestone.metrics.map((metric, metricIndex) => (
                      <Typography key={metricIndex} variant="caption" display="block" color="text.secondary">
                        • {metric}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};

