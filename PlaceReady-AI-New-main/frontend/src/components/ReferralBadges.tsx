import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { EmojiEvents, TrendingUp, Star } from '@mui/icons-material';

interface ReferralBadgesProps {
  currentScore: number;
  previousScore?: number;
  improvement?: number;
}

export const ReferralBadges: React.FC<ReferralBadgesProps> = ({
  currentScore,
  previousScore,
  improvement,
}) => {
  const badges: Array<{ icon: React.ReactNode; label: string; color: string }> = [];

  // Improvement badges
  if (improvement && improvement > 0) {
    if (improvement >= 10) {
      badges.push({
        icon: <EmojiEvents />,
        label: `Major Improvement (+${improvement}%)`,
        color: '#f59e0b',
      });
    } else if (improvement >= 5) {
      badges.push({
        icon: <TrendingUp />,
        label: `Good Progress (+${improvement}%)`,
        color: '#10b981',
      });
    } else {
      badges.push({
        icon: <Star />,
        label: `Improving (+${improvement}%)`,
        color: '#3b82f6',
      });
    }
  }

  // Score-based badges
  if (currentScore >= 90) {
    badges.push({
      icon: <EmojiEvents />,
      label: 'Perfect Resume',
      color: '#f59e0b',
    });
  } else if (currentScore >= 80) {
    badges.push({
      icon: <Star />,
      label: 'Excellent Score',
      color: '#10b981',
    });
  }

  if (badges.length === 0) return null;

  return (
    <Paper sx={{ p: 2, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
        🏆 Achievement Badges
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {badges.map((badge, index) => (
          <Chip
            key={index}
            icon={badge.icon as React.ReactElement}
            label={badge.label}
            sx={{
              backgroundColor: badge.color + '20',
              color: badge.color,
              fontWeight: 600,
              border: `2px solid ${badge.color}`,
              height: 32,
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

