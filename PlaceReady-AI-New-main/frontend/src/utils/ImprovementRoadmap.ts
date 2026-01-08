// Improvement Roadmap Generator
export interface RoadmapPhase {
  phase: string;
  duration: string;
  goals: string[];
  resources: string[];
  milestones: string[];
}

export interface ImprovementRoadmap {
  currentLevel: string;
  targetLevel: string;
  phases: RoadmapPhase[];
}

export const generateRoadmap = (currentScore: number, skills: string[]): ImprovementRoadmap => {
  const currentLevel = currentScore < 50 ? 'Beginner' : currentScore < 70 ? 'Intermediate' : 'Advanced';
  const targetLevel = 'Expert';
  
  const isJunior = currentScore < 60;
  const isMid = currentScore >= 60 && currentScore < 80;
  
  const phases: RoadmapPhase[] = [
    {
      phase: '3-Month Sprint: Foundation Building',
      duration: '3 months',
      goals: [
        'Complete core DSA fundamentals',
        'Master 1-2 primary tech stacks',
        'Build 2-3 small projects',
        'Increase score from ' + currentScore + '% to 65%'
      ],
      resources: [
        'LeetCode 30-day challenge',
        'Udemy courses on chosen tech',
        'YouTube tutorials',
        'GitHub portfolio setup'
      ],
      milestones: [
        'Month 1: Complete DSA basics',
        'Month 2: 2 projects completed',
        'Month 3: Code 100 LeetCode problems'
      ]
    },
    {
      phase: '3-Month Sprint: Intermediate Skills',
      duration: '3 months',
      goals: [
        'Master system design concepts',
        'Build 1 production-ready project',
        'Contribute to 3 open-source projects',
        'Increase score to 75%'
      ],
      resources: [
        'System Design Primer',
        'Interview.io mock interviews',
        'GitHub Issues from popular repos',
        'Technical blogs (Medium, Dev.to)'
      ],
      milestones: [
        'Month 1: System design fundamentals',
        'Month 2: Production project deployed',
        'Month 3: 3 OSS contributions merged'
      ]
    },
    {
      phase: '3-Month Sprint: Expert Level',
      duration: '3 months',
      goals: [
        'Master advanced topics (Microservices, Scalability)',
        'Publish technical blog posts',
        'Mentor 2-3 junior developers',
        'Achieve 85%+ readiness score'
      ],
      resources: [
        'Research papers on distributed systems',
        'Advanced Udemy courses',
        'Mentorship platforms',
        'Tech conference talks'
      ],
      milestones: [
        'Month 1: Microservices deep dive',
        'Month 2: 4 blog posts published',
        'Month 3: Mentored 2+ juniors'
      ]
    }
  ];
  
  return {
    currentLevel,
    targetLevel,
    phases
  };
};

export const getRoadmapPhase = (currentScore: number): number => {
  if (currentScore < 60) return 0;
  if (currentScore < 75) return 1;
  return 2;
};
