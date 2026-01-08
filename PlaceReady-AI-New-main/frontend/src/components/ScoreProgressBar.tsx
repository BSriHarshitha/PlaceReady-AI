import React from 'react';
import { Box, LinearProgress, Typography, Tooltip, Chip } from '@mui/material';
import { InfoOutlined, TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { AnimatedCounter } from './AnimatedCounter';

interface ScoreProgressBarProps {
  score: number;
  label: string;
  previousScore?: number;
  tooltipText?: string;
  showTrend?: boolean;
}

export const ScoreProgressBar: React.FC<ScoreProgressBarProps> = ({
  score,
  label,
  previousScore,
  tooltipText,
  showTrend = true
}) => {
  const improvement = previousScore ? score - previousScore : null;
  
  const getColor = (value: number) => {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#3b82f6';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTrendIcon = () => {
    if (!improvement) return null;
    if (improvement > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
    if (improvement < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
    return <Remove sx={{ fontSize: 16 }} />;
  };

  const getTrendColor = () => {
    if (!improvement) return '#64748b';
    if (improvement > 0) return '#10b981';
    if (improvement < 0) return '#ef4444';
    return '#64748b';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText} arrow>
              <InfoOutlined sx={{ fontSize: 16, color: '#64748b', cursor: 'help' }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnimatedCounter end={score} suffix="%" variant="body2" sx={{ fontWeight: 700, color: getColor(score) }} />
          {showTrend && improvement !== null && getTrendIcon() && (
            <Chip
              icon={getTrendIcon() as React.ReactElement}
              label={`${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                backgroundColor: getTrendColor() + '20',
                color: getTrendColor(),
                fontWeight: 600,
                '& .MuiChip-icon': { color: getTrendColor() },
              }}
            />
          )}
        </Box>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={score} 
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e2e8f0',
          transition: 'all 0.3s ease',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getColor(score),
            borderRadius: 5,
            transition: 'all 0.3s ease',
          }
        }}
      />
    </Box>
  );
};
