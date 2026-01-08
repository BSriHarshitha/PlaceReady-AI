// Industry benchmark data
export interface IndustryBenchmark {
  role: string;
  averageScore: number;
  resumeScore: number;
  codingScore: number;
  linkedinScore: number;
}

export const industryBenchmarks: Record<string, IndustryBenchmark> = {
  'Web Developer': {
    role: 'Web Developer',
    averageScore: 72,
    resumeScore: 75,
    codingScore: 68,
    linkedinScore: 73,
  },
  'Data Scientist': {
    role: 'Data Scientist',
    averageScore: 78,
    resumeScore: 80,
    codingScore: 75,
    linkedinScore: 79,
  },
  'Software Engineer': {
    role: 'Software Engineer',
    averageScore: 75,
    resumeScore: 77,
    codingScore: 72,
    linkedinScore: 76,
  },
  'Frontend Developer': {
    role: 'Frontend Developer',
    averageScore: 70,
    resumeScore: 73,
    codingScore: 67,
    linkedinScore: 70,
  },
  'Backend Developer': {
    role: 'Backend Developer',
    averageScore: 74,
    resumeScore: 76,
    codingScore: 71,
    linkedinScore: 75,
  },
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    averageScore: 76,
    resumeScore: 78,
    codingScore: 73,
    linkedinScore: 77,
  },
  'DevOps Engineer': {
    role: 'DevOps Engineer',
    averageScore: 77,
    resumeScore: 79,
    codingScore: 74,
    linkedinScore: 78,
  },
  'Mobile Developer': {
    role: 'Mobile Developer',
    averageScore: 73,
    resumeScore: 75,
    codingScore: 70,
    linkedinScore: 74,
  },
};

export const calculatePercentile = (userScore: number, averageScore: number): number => {
  // Simplified percentile calculation
  const diff = userScore - averageScore;
  if (diff >= 20) return 95;
  if (diff >= 15) return 90;
  if (diff >= 10) return 80;
  if (diff >= 5) return 70;
  if (diff >= 0) return 60;
  if (diff >= -5) return 50;
  if (diff >= -10) return 40;
  if (diff >= -15) return 30;
  return 20;
};

export const getCommunityBenchmark = (userScore: number): string => {
  if (userScore >= 90) return '99%';
  if (userScore >= 85) return '95%';
  if (userScore >= 80) return '90%';
  if (userScore >= 75) return '80%';
  if (userScore >= 70) return '70%';
  if (userScore >= 65) return '60%';
  if (userScore >= 60) return '50%';
  return '40%';
};

