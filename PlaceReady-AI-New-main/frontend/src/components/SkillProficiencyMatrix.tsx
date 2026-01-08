import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';

interface SkillProficiencyMatrixProps {
  skills: Array<{ name: string; level: 'beginner' | 'intermediate' | 'advanced'; score: number }>;
}

export const SkillProficiencyMatrix: React.FC<SkillProficiencyMatrixProps> = ({ skills }) => {
  const getColor = (level: string) => {
    switch (level) {
      case 'advanced': return '#10b981';
      case 'intermediate': return '#3b82f6';
      case 'beginner': return '#f59e0b';
      default: return '#e2e8f0';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'advanced': return 'Advanced';
      case 'intermediate': return 'Intermediate';
      case 'beginner': return 'Beginner';
      default: return 'Unknown';
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Skill Proficiency Matrix
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 2,
        }}
      >
        {skills.map((skill, index) => (
          <Tooltip
            key={index}
            title={`${skill.name}: ${getLevelLabel(skill.level)} (${skill.score}%)`}
            arrow
          >
            <Box
              sx={{
                position: 'relative',
                height: 100,
                borderRadius: 2,
                backgroundColor: getColor(skill.level),
                opacity: 0.8,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textAlign: 'center',
                  px: 1,
                  fontSize: '0.7rem',
                }}
              >
                {skill.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '0.65rem',
                  mt: 0.5,
                }}
              >
                {getLevelLabel(skill.level)}
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  right: 4,
                  height: 3,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${skill.score}%`,
                    backgroundColor: 'white',
                    borderRadius: 1.5,
                  }}
                />
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 1, backgroundColor: '#f59e0b' }} />
          <Typography variant="caption">Beginner</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 1, backgroundColor: '#3b82f6' }} />
          <Typography variant="caption">Intermediate</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 1, backgroundColor: '#10b981' }} />
          <Typography variant="caption">Advanced</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

