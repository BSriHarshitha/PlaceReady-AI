import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Achievement, checkAchievements } from '../utils/Achievements';

interface AchievementBadgesProps {
  score: number;
  skills: string[];
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ score, skills }) => {
  const earned = checkAchievements(score, skills);

  if (earned.length === 0) return null;

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        🏆 Achievements Unlocked ({earned.length})
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {earned.map(achievement => (
          <Chip
            key={achievement.id}
            label={`${achievement.icon} ${achievement.title}`}
            sx={{
              backgroundColor: achievement.color + '20',
              color: achievement.color,
              fontWeight: 600,
              border: `2px solid ${achievement.color}`,
              height: 32,
              '& .MuiChip-label': {
                paddingX: 1
              }
            }}
            title={achievement.description}
          />
        ))}
      </Box>
    </Box>
  );
};
