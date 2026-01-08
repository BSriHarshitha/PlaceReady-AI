import React from 'react';
import { Box, Paper, Typography, Chip, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StrengthWeaknessSummaryProps {
  strengths: Array<{ skill: string; score: number }>;
  weaknesses: Array<{ skill: string; score: number; reason?: string }>;
}

export const StrengthWeaknessSummary: React.FC<StrengthWeaknessSummaryProps> = ({
  strengths,
  weaknesses,
}) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp sx={{ color: '#10b981', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Top 3 Strengths
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {strengths.slice(0, 3).map((strength, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}. {strength.skill}
                  </Typography>
                  <Chip
                    label={`${strength.score}%`}
                    size="small"
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: 700,
                      height: 24,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingDown sx={{ color: '#ef4444', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Top 3 Gaps
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {weaknesses.slice(0, 3).map((weakness, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}. {weakness.skill}
                  </Typography>
                  <Chip
                    label={`${weakness.score}%`}
                    size="small"
                    sx={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontWeight: 700,
                      height: 24,
                    }}
                  />
                </Box>
                {weakness.reason && (
                  <Typography variant="caption" color="text.secondary">
                    {weakness.reason}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

