import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

export const SkillAnalysisSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1, minWidth: 350 }}>
        <Paper sx={{ p: 3, borderRadius: 2.5 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={24} />
        </Paper>
      </Box>
      <Box sx={{ flex: 1, minWidth: 350 }}>
        <Paper sx={{ p: 3, borderRadius: 2.5 }}>
          <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2 }}>
            <Skeleton variant="rectangular" height={80} />
            <Skeleton variant="rectangular" height={80} />
            <Skeleton variant="rectangular" height={80} />
          </Box>
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={70} height={32} />
            <Skeleton variant="rounded" width={90} height={32} />
          </Box>
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        </Paper>
      </Box>
    </Box>
  );
};

