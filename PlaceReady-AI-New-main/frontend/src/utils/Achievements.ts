// Achievement & Badge System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (score: number, skills: string[]) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'perfect_resume',
    title: 'Resume Master',
    description: 'Resume score above 85%',
    icon: '📄',
    color: '#10b981',
    condition: (score) => score >= 85
  },
  {
    id: 'coding_star',
    title: 'Coding Star',
    description: 'Coding score above 80%',
    icon: '⭐',
    color: '#f59e0b',
    condition: (score) => score >= 80
  },
  {
    id: 'full_stack',
    title: 'Full Stack Developer',
    description: 'Has both frontend and backend skills',
    icon: '🔧',
    color: '#3b82f6',
    condition: (_, skills) => {
      const frontend = skills.some(s => ['react', 'angular', 'vue', 'javascript'].some(f => s.toLowerCase().includes(f)));
      const backend = skills.some(s => ['node.js', 'python', 'java', 'django'].some(b => s.toLowerCase().includes(b)));
      return frontend && backend;
    }
  },
  {
    id: 'cloud_ready',
    title: 'Cloud Ready',
    description: 'Has AWS, GCP, or Azure skills',
    icon: '☁️',
    color: '#06b6d4',
    condition: (_, skills) => skills.some(s => ['aws', 'gcp', 'azure', 'cloud'].some(c => s.toLowerCase().includes(c)))
  },
  {
    id: 'devops_expert',
    title: 'DevOps Expert',
    description: 'Has Docker & Kubernetes knowledge',
    icon: '🚀',
    color: '#ef4444',
    condition: (_, skills) => {
      const docker = skills.some(s => s.toLowerCase().includes('docker'));
      const k8s = skills.some(s => s.toLowerCase().includes('kubernetes'));
      return docker && k8s;
    }
  },
  {
    id: 'ready_to_apply',
    title: 'Ready to Apply',
    description: 'Overall readiness score above 70%',
    icon: '✅',
    color: '#8b5cf6',
    condition: (score) => score >= 70
  },
  {
    id: 'excellent_profile',
    title: 'Excellent Profile',
    description: 'Overall readiness score above 85%',
    icon: '🏆',
    color: '#fbbf24',
    condition: (score) => score >= 85
  },
  {
    id: 'balanced_skills',
    title: 'Balanced Skills',
    description: 'Has 15+ different skills',
    icon: '⚖️',
    color: '#06b6d4',
    condition: (_, skills) => skills.length >= 15
  }
];

export const checkAchievements = (score: number, skills: string[]): Achievement[] => {
  return achievements.filter(achievement => achievement.condition(score, skills));
};
