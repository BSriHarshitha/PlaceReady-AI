import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Line,
  Bar,
  Doughnut,
  Pie,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminChartsProps {
  users: any[];
}

export const AdminCharts: React.FC<AdminChartsProps> = ({ users }) => {
  const usersWithAnalysis = users.filter(u => u.analysis);
  
  const stats = {
    ready: usersWithAnalysis.filter(u => u.analysis.finalScore >= 70).length,
    almostReady: usersWithAnalysis.filter(u => u.analysis.finalScore >= 50 && u.analysis.finalScore < 70).length,
    needsImprovement: usersWithAnalysis.filter(u => u.analysis.finalScore < 50).length,
  };
  
  // Score Distribution Data
  const scoreRanges = {
    '0-30': usersWithAnalysis.filter(u => u.analysis.finalScore >= 0 && u.analysis.finalScore <= 30).length,
    '31-50': usersWithAnalysis.filter(u => u.analysis.finalScore >= 31 && u.analysis.finalScore <= 50).length,
    '51-70': usersWithAnalysis.filter(u => u.analysis.finalScore >= 51 && u.analysis.finalScore <= 70).length,
    '71-85': usersWithAnalysis.filter(u => u.analysis.finalScore >= 71 && u.analysis.finalScore <= 85).length,
    '86-100': usersWithAnalysis.filter(u => u.analysis.finalScore >= 86 && u.analysis.finalScore <= 100).length,
  };

  // Skill Gap Analysis
  const skillGaps: Record<string, number> = {};
  usersWithAnalysis.forEach(user => {
    user.analysis.skillGaps?.forEach((gap: string) => {
      skillGaps[gap] = (skillGaps[gap] || 0) + 1;
    });
  });
  const topSkillGaps = Object.entries(skillGaps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Trend Data (last 7 days simulation)
  const trendData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    ready: [Math.max(0, stats.ready - 10), Math.max(0, stats.ready - 8), Math.max(0, stats.ready - 5), Math.max(0, stats.ready - 3), Math.max(0, stats.ready - 2), Math.max(0, stats.ready - 1), stats.ready],
    almostReady: [Math.max(0, stats.almostReady - 5), Math.max(0, stats.almostReady - 4), Math.max(0, stats.almostReady - 3), Math.max(0, stats.almostReady - 2), Math.max(0, stats.almostReady - 1), stats.almostReady - 1, stats.almostReady],
    needsImprovement: [Math.max(0, stats.needsImprovement - 2), Math.max(0, stats.needsImprovement - 1), stats.needsImprovement - 1, stats.needsImprovement - 1, stats.needsImprovement, stats.needsImprovement, stats.needsImprovement],
  };

  const scoreDistributionData = {
    labels: Object.keys(scoreRanges),
    datasets: [{
      label: 'Number of Students',
      data: Object.values(scoreRanges),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const readinessDistributionData = {
    labels: ['Ready (70%+)', 'Almost Ready (50-69%)', 'Needs Improvement (<50%)'],
    datasets: [{
      data: [stats.ready, stats.almostReady, stats.needsImprovement],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const skillGapData = {
    labels: topSkillGaps.map(([gap]) => gap),
    datasets: [{
      label: 'Students Affected',
      data: topSkillGaps.map(([, count]) => count),
      backgroundColor: 'rgba(245, 158, 11, 0.8)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
    }],
  };

  const trendLineData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Ready',
        data: trendData.ready,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Almost Ready',
        data: trendData.almostReady,
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Needs Improvement',
        data: trendData.needsImprovement,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Score Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar data={scoreDistributionData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Readiness Status
          </Typography>
          <Box sx={{ height: 300 }}>
            <Doughnut data={readinessDistributionData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Performance Trends (Last 7 Days)
          </Typography>
          <Box sx={{ height: 300 }}>
            <Line data={trendLineData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Top 5 Skill Gaps Across Batch
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar 
              data={skillGapData} 
              options={{
                ...chartOptions,
                indexAxis: 'y' as const,
              }} 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

