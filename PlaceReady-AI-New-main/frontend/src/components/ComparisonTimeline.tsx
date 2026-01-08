import React from 'react';
import { Box, Paper, Typography, Card, CardContent, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

interface AnalysisSnapshot {
  date: string;
  finalScore: number;
  resumeScore: number;
  codingScore: number;
  linkedinScore: number;
}

interface ComparisonTimelineProps {
  analyses: AnalysisSnapshot[];
  currentAnalysis: AnalysisSnapshot;
}

export const ComparisonTimeline: React.FC<ComparisonTimelineProps> = ({
  analyses,
  currentAnalysis,
}) => {
  const allAnalyses = [currentAnalysis, ...analyses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) return { icon: <TrendingUp />, color: '#10b981', text: `+${diff.toFixed(1)}%` };
    if (diff < 0) return { icon: <TrendingDown />, color: '#ef4444', text: `${diff.toFixed(1)}%` };
    return { icon: <Remove />, color: '#64748b', text: '0%' };
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Progress Timeline
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {allAnalyses.map((analysis, index) => {
          const previous = allAnalyses[index + 1];
          const trend = getTrend(analysis.finalScore, previous?.finalScore);
          const isLatest = index === 0;

          return (
            <Card
              key={index}
              sx={{
                borderLeft: `4px solid ${isLatest ? '#4f46e5' : '#e2e8f0'}`,
                boxShadow: isLatest ? '0 2px 8px rgba(79, 70, 229, 0.2)' : 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {new Date(analysis.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                    {isLatest && (
                      <Chip label="Latest" size="small" color="primary" sx={{ mt: 0.5, height: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                      {analysis.finalScore}%
                    </Typography>
                    {trend && (
                      <Chip
                        icon={trend.icon}
                        label={trend.text}
                        size="small"
                        sx={{
                          backgroundColor: trend.color + '20',
                          color: trend.color,
                          height: 24,
                          '& .MuiChip-icon': { color: trend.color },
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Resume
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analysis.resumeScore}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Coding
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analysis.codingScore}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Profile
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {analysis.linkedinScore}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      {allAnalyses.length === 1 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Complete more analyses to see your progress timeline
        </Typography>
      )}
    </Paper>
  );
};

