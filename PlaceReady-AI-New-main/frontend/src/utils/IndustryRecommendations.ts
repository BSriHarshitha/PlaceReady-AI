// Industry-Specific Recommendations Generator
export interface IndustryRecommendations {
  role: string;
  essentialSkills: string[];
  recommendations: string[];
}

export const industryRoleMap: Record<string, IndustryRecommendations> = {
  'Frontend Developer': {
    role: 'Frontend Developer',
    essentialSkills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
    recommendations: [
      'Master React hooks and state management (Redux/Context)',
      'Learn CSS Grid and Flexbox deeply',
      'Practice responsive design and mobile-first development',
      'Build a strong portfolio with 3-5 production projects',
      'Contribute to open-source frontend projects',
      'Learn testing frameworks (Jest, React Testing Library)',
      'Master browser DevTools and performance optimization',
      'Study web accessibility (WCAG) standards'
    ]
  },
  'Backend Developer': {
    role: 'Backend Developer',
    essentialSkills: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB'],
    recommendations: [
      'Master RESTful API design and GraphQL',
      'Learn database optimization and indexing',
      'Understand microservices architecture',
      'Practice designing scalable systems',
      'Learn authentication & authorization (JWT, OAuth)',
      'Study message queues (RabbitMQ, Kafka)',
      'Master Docker and containerization',
      'Learn caching strategies (Redis)'
    ]
  },
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    essentialSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'MongoDB'],
    recommendations: [
      'Build end-to-end applications (frontend + backend)',
      'Master both client and server-side rendering',
      'Learn deployment strategies (AWS, Heroku)',
      'Practice database design and optimization',
      'Understand security best practices',
      'Learn testing at all levels (unit, integration, e2e)',
      'Master version control and CI/CD pipelines',
      'Study performance optimization techniques'
    ]
  },
  'DevOps Engineer': {
    role: 'DevOps Engineer',
    essentialSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    recommendations: [
      'Master Kubernetes orchestration',
      'Deep dive into AWS services (EC2, S3, RDS, Lambda)',
      'Learn Infrastructure as Code (Terraform, CloudFormation)',
      'Master CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions)',
      'Understand monitoring & logging (Prometheus, ELK)',
      'Learn shell scripting and Linux administration',
      'Practice disaster recovery and backup strategies',
      'Study cloud security best practices'
    ]
  },
  'Data Scientist': {
    role: 'Data Scientist',
    essentialSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
    recommendations: [
      'Master machine learning algorithms (supervised & unsupervised)',
      'Learn deep learning with TensorFlow/PyTorch',
      'Practice feature engineering and data preprocessing',
      'Study statistical analysis and hypothesis testing',
      'Learn data visualization (Matplotlib, Seaborn, Plotly)',
      'Master SQL for complex queries',
      'Practice building end-to-end ML pipelines',
      'Study A/B testing and experimentation'
    ]
  },
  'Product Manager': {
    role: 'Product Manager',
    essentialSkills: ['Analytics', 'Communication', 'Problem Solving', 'Leadership'],
    recommendations: [
      'Learn product metrics and KPIs',
      'Master user research methodologies',
      'Study competitive analysis frameworks',
      'Practice roadmap planning and prioritization',
      'Learn technical fundamentals of your domain',
      'Master stakeholder communication',
      'Study product strategy and positioning',
      'Practice data-driven decision making'
    ]
  },
  'Mobile Developer': {
    role: 'Mobile Developer',
    essentialSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'JavaScript'],
    recommendations: [
      'Master React Native for cross-platform development',
      'Learn native development (Swift for iOS, Kotlin for Android)',
      'Practice mobile UI/UX best practices',
      'Learn mobile app testing and debugging',
      'Master app performance optimization',
      'Study mobile security (encryption, secure storage)',
      'Learn push notifications and background processing',
      'Practice API integration and data persistence'
    ]
  }
};

export const detectRole = (skills: string[]): string => {
  const skillsLower = skills.map(s => s.toLowerCase());
  
  const roleScores: Record<string, number> = {
    'Frontend Developer': 0,
    'Backend Developer': 0,
    'Full Stack Developer': 0,
    'DevOps Engineer': 0,
    'Data Scientist': 0,
    'Mobile Developer': 0
  };
  
  if (skillsLower.some(s => s.includes('react') || s.includes('angular') || s.includes('vue'))) {
    roleScores['Frontend Developer'] += 2;
    roleScores['Full Stack Developer'] += 1;
  }
  
  if (skillsLower.some(s => s.includes('node') || s.includes('python') || s.includes('java'))) {
    roleScores['Backend Developer'] += 2;
    roleScores['Full Stack Developer'] += 1;
  }
  
  if (skillsLower.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws'))) {
    roleScores['DevOps Engineer'] += 2;
  }
  
  if (skillsLower.some(s => s.includes('tensorflow') || s.includes('pandas') || s.includes('machine learning'))) {
    roleScores['Data Scientist'] += 2;
  }
  
  if (skillsLower.some(s => s.includes('swift') || s.includes('kotlin') || s.includes('react native'))) {
    roleScores['Mobile Developer'] += 2;
  }
  
  const topRole = Object.entries(roleScores).sort(([,a], [,b]) => b - a)[0];
  return topRole ? topRole[0] : 'Full Stack Developer';
};

export const getIndustryRecommendations = (skills: string[]): IndustryRecommendations => {
  const role = detectRole(skills);
  return industryRoleMap[role] || industryRoleMap['Full Stack Developer'];
};
