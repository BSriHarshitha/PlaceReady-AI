// Skill demand scores based on current market trends
export interface SkillDemandData {
  skill: string;
  demandScore: number; // 0-100
  trend: 'rising' | 'stable' | 'declining';
  jobOpenings: string; // e.g., "10K+"
}

export const skillDemandDatabase: Record<string, SkillDemandData> = {
  'React': { skill: 'React', demandScore: 95, trend: 'rising', jobOpenings: '50K+' },
  'JavaScript': { skill: 'JavaScript', demandScore: 98, trend: 'stable', jobOpenings: '80K+' },
  'Python': { skill: 'Python', demandScore: 96, trend: 'rising', jobOpenings: '70K+' },
  'Java': { skill: 'Java', demandScore: 92, trend: 'stable', jobOpenings: '60K+' },
  'AWS': { skill: 'AWS', demandScore: 94, trend: 'rising', jobOpenings: '45K+' },
  'Docker': { skill: 'Docker', demandScore: 89, trend: 'rising', jobOpenings: '35K+' },
  'Kubernetes': { skill: 'Kubernetes', demandScore: 87, trend: 'rising', jobOpenings: '25K+' },
  'System Design': { skill: 'System Design', demandScore: 91, trend: 'stable', jobOpenings: '30K+' },
  'Node.js': { skill: 'Node.js', demandScore: 88, trend: 'stable', jobOpenings: '40K+' },
  'TypeScript': { skill: 'TypeScript', demandScore: 90, trend: 'rising', jobOpenings: '30K+' },
  'Angular': { skill: 'Angular', demandScore: 82, trend: 'stable', jobOpenings: '25K+' },
  'Vue.js': { skill: 'Vue.js', demandScore: 78, trend: 'rising', jobOpenings: '15K+' },
  'MongoDB': { skill: 'MongoDB', demandScore: 85, trend: 'stable', jobOpenings: '20K+' },
  'PostgreSQL': { skill: 'PostgreSQL', demandScore: 83, trend: 'stable', jobOpenings: '25K+' },
  'Redis': { skill: 'Redis', demandScore: 81, trend: 'rising', jobOpenings: '15K+' },
  'GraphQL': { skill: 'GraphQL', demandScore: 79, trend: 'rising', jobOpenings: '12K+' },
  'Machine Learning': { skill: 'Machine Learning', demandScore: 93, trend: 'rising', jobOpenings: '35K+' },
  'Data Science': { skill: 'Data Science', demandScore: 91, trend: 'rising', jobOpenings: '40K+' },
  'TensorFlow': { skill: 'TensorFlow', demandScore: 86, trend: 'rising', jobOpenings: '18K+' },
  'PyTorch': { skill: 'PyTorch', demandScore: 84, trend: 'rising', jobOpenings: '15K+' },
  'Git': { skill: 'Git', demandScore: 96, trend: 'stable', jobOpenings: '100K+' },
  'CI/CD': { skill: 'CI/CD', demandScore: 88, trend: 'rising', jobOpenings: '30K+' },
  'Microservices': { skill: 'Microservices', demandScore: 89, trend: 'stable', jobOpenings: '28K+' },
};

export const calculateSkillDemandScore = (skills: string[]): number => {
  if (skills.length === 0) return 0;
  
  const demandScores = skills
    .map((skill) => {
      const normalized = skill.toLowerCase();
      const match = Object.keys(skillDemandDatabase).find(
        (key) => key.toLowerCase() === normalized || normalized.includes(key.toLowerCase())
      );
      return match ? skillDemandDatabase[match].demandScore : 70; // Default for unknown skills
    })
    .filter(Boolean);

  if (demandScores.length === 0) return 70;
  
  const average = demandScores.reduce((sum, score) => sum + score, 0) / demandScores.length;
  return Math.round(average);
};

export const getTopInDemandSkills = (userSkills: string[]): Array<SkillDemandData> => {
  const skillDemands = userSkills
    .map((skill) => {
      const normalized = skill.toLowerCase();
      const match = Object.keys(skillDemandDatabase).find(
        (key) => key.toLowerCase() === normalized || normalized.includes(key.toLowerCase())
      );
      return match ? { ...skillDemandDatabase[match], userSkill: skill } : null;
    })
    .filter(Boolean) as Array<SkillDemandData & { userSkill: string }>;

  return skillDemands
    .sort((a, b) => b.demandScore - a.demandScore)
    .slice(0, 5)
    .map(({ userSkill, ...rest }) => rest);
};

