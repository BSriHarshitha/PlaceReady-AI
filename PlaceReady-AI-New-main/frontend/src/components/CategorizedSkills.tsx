import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { categorizeSkills, getSkillsByCategory } from '../utils/SkillCategories';

interface CategorizedSkillsProps {
  skills: string[];
}

export const CategorizedSkills: React.FC<CategorizedSkillsProps> = ({ skills }) => {
  const categorized = categorizeSkills(skills);
  const grouped = getSkillsByCategory(categorized);

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Beginner': return '#f59e0b';
      case 'Intermediate': return '#3b82f6';
      case 'Advanced': return '#8b5cf6';
      case 'Expert': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <Box>
      {Object.entries(grouped).map(([category, categorySkills]) => 
        categorySkills.length > 0 ? (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
              {category}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {categorySkills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={`${skill.name} • ${skill.level}`}
                  size="small"
                  icon={skill.inDemand ? undefined : undefined}
                  sx={{
                    backgroundColor: getLevelColor(skill.level) + '20',
                    color: getLevelColor(skill.level),
                    fontWeight: 600,
                    border: `1px solid ${getLevelColor(skill.level)}`,
                    height: 28
                  }}
                  title={skill.inDemand ? 'High demand skill' : 'Growing demand'}
                />
              ))}
            </Box>
          </Box>
        ) : null
      )}
    </Box>
  );
};
