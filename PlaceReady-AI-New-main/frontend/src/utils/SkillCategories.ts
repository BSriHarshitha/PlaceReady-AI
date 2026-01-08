// Skill Categorization & Proficiency System
export interface SkillWithLevel {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Data Science' | 'Tools' | 'Soft Skills';
  inDemand: boolean;
}

export const skillDatabase: Record<string, { level: string; category: string; demand: boolean }> = {
  // Frontend
  'react': { level: 'Intermediate', category: 'Frontend', demand: true },
  'angular': { level: 'Intermediate', category: 'Frontend', demand: true },
  'vue': { level: 'Intermediate', category: 'Frontend', demand: true },
  'javascript': { level: 'Intermediate', category: 'Frontend', demand: true },
  'typescript': { level: 'Advanced', category: 'Frontend', demand: true },
  'html': { level: 'Beginner', category: 'Frontend', demand: true },
  'css': { level: 'Beginner', category: 'Frontend', demand: true },
  'next.js': { level: 'Advanced', category: 'Frontend', demand: true },
  'svelte': { level: 'Advanced', category: 'Frontend', demand: false },
  
  // Backend
  'node.js': { level: 'Intermediate', category: 'Backend', demand: true },
  'python': { level: 'Intermediate', category: 'Backend', demand: true },
  'java': { level: 'Intermediate', category: 'Backend', demand: true },
  'c++': { level: 'Advanced', category: 'Backend', demand: true },
  'go': { level: 'Advanced', category: 'Backend', demand: true },
  'rust': { level: 'Advanced', category: 'Backend', demand: true },
  'django': { level: 'Intermediate', category: 'Backend', demand: true },
  'flask': { level: 'Intermediate', category: 'Backend', demand: true },
  'express': { level: 'Intermediate', category: 'Backend', demand: true },
  'spring': { level: 'Intermediate', category: 'Backend', demand: true },
  'mysql': { level: 'Intermediate', category: 'Backend', demand: true },
  'postgresql': { level: 'Intermediate', category: 'Backend', demand: true },
  'mongodb': { level: 'Intermediate', category: 'Backend', demand: true },
  'redis': { level: 'Advanced', category: 'Backend', demand: true },
  
  // DevOps
  'docker': { level: 'Advanced', category: 'DevOps', demand: true },
  'kubernetes': { level: 'Advanced', category: 'DevOps', demand: true },
  'aws': { level: 'Advanced', category: 'DevOps', demand: true },
  'gcp': { level: 'Advanced', category: 'DevOps', demand: true },
  'azure': { level: 'Advanced', category: 'DevOps', demand: true },
  'ci/cd': { level: 'Intermediate', category: 'DevOps', demand: true },
  'jenkins': { level: 'Intermediate', category: 'DevOps', demand: true },
  'terraform': { level: 'Advanced', category: 'DevOps', demand: true },
  
  // Data Science
  'machine learning': { level: 'Advanced', category: 'Data Science', demand: true },
  'tensorflow': { level: 'Advanced', category: 'Data Science', demand: true },
  'pytorch': { level: 'Advanced', category: 'Data Science', demand: true },
  'pandas': { level: 'Intermediate', category: 'Data Science', demand: true },
  'numpy': { level: 'Intermediate', category: 'Data Science', demand: true },
  'sql': { level: 'Intermediate', category: 'Data Science', demand: true },
  
  // Tools
  'git': { level: 'Intermediate', category: 'Tools', demand: true },
  'github': { level: 'Intermediate', category: 'Tools', demand: true },
  'gitlab': { level: 'Intermediate', category: 'Tools', demand: true },
  'jira': { level: 'Beginner', category: 'Tools', demand: true },
  'figma': { level: 'Intermediate', category: 'Tools', demand: true },
  'vs code': { level: 'Beginner', category: 'Tools', demand: true },
  
  // Soft Skills
  'leadership': { level: 'Advanced', category: 'Soft Skills', demand: true },
  'communication': { level: 'Intermediate', category: 'Soft Skills', demand: true },
  'teamwork': { level: 'Intermediate', category: 'Soft Skills', demand: true },
  'problem solving': { level: 'Intermediate', category: 'Soft Skills', demand: true },
};

export const categorizeSkills = (skills: string[]): SkillWithLevel[] => {
  return skills.map(skill => {
    const skillLower = skill.toLowerCase();
    const found = skillDatabase[skillLower];
    
    if (found) {
      return {
        name: skill,
        level: found.level as any,
        category: found.category as any,
        inDemand: found.demand
      };
    }
    
    return {
      name: skill,
      level: 'Intermediate',
      category: 'Tools',
      inDemand: true
    };
  });
};

export const getSkillsByCategory = (skills: SkillWithLevel[]): Record<string, SkillWithLevel[]> => {
  const grouped: Record<string, SkillWithLevel[]> = {
    Frontend: [],
    Backend: [],
    DevOps: [],
    'Data Science': [],
    Tools: [],
    'Soft Skills': []
  };
  
  skills.forEach(skill => {
    grouped[skill.category]?.push(skill);
  });
  
  return grouped;
};

export const getLevelColor = (level: string): string => {
  switch (level) {
    case 'Beginner': return '#f59e0b';
    case 'Intermediate': return '#3b82f6';
    case 'Advanced': return '#8b5cf6';
    case 'Expert': return '#dc2626';
    default: return '#6b7280';
  }
};
