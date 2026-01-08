export interface LearningPathStep {
  step: number;
  title: string;
  description: string;
  resources: Array<{ title: string; url: string; type: 'course' | 'article' | 'video' | 'practice' }>;
  estimatedTime: string;
}

export interface LearningPath {
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: LearningPathStep[];
  totalEstimatedTime: string;
}

const learningResources: Record<string, Record<string, any>> = {
  'System Design': {
    beginner: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' },
      { title: 'Grokking System Design', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', type: 'course' },
    ],
    intermediate: [
      { title: 'System Design Interview', url: 'https://www.youtube.com/playlist?list=PLMCXHnjxnTnvo6alSjVkgxV-VH6EPyvoX', type: 'video' },
      { title: 'Designing Data-Intensive Applications', url: 'https://www.amazon.com/dp/1449373321', type: 'article' },
    ],
    advanced: [
      { title: 'High Scalability Blog', url: 'http://highscalability.com/', type: 'article' },
      { title: 'Building Microservices', url: 'https://www.oreilly.com/library/view/building-microservices/9781491950340/', type: 'article' },
    ],
  },
  'Docker/Kubernetes': {
    beginner: [
      { title: 'Docker Tutorial', url: 'https://docs.docker.com/get-started/', type: 'course' },
      { title: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type: 'course' },
    ],
    intermediate: [
      { title: 'Docker Mastery', url: 'https://www.udemy.com/course/docker-mastery/', type: 'course' },
      { title: 'Kubernetes Hands-On', url: 'https://www.udemy.com/course/kubernetes-hands-on/', type: 'course' },
    ],
    advanced: [
      { title: 'CKAD Exam Prep', url: 'https://www.cncf.io/certification/ckad/', type: 'practice' },
      { title: 'Kubernetes The Hard Way', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', type: 'article' },
    ],
  },
  'AWS/Cloud': {
    beginner: [
      { title: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/', type: 'course' },
      { title: 'AWS Free Tier Tutorials', url: 'https://aws.amazon.com/free/', type: 'course' },
    ],
    intermediate: [
      { title: 'AWS Solutions Architect', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', type: 'course' },
      { title: 'AWS Hands-On Labs', url: 'https://www.aws.training/', type: 'practice' },
    ],
    advanced: [
      { title: 'AWS Solutions Architect Professional', url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/', type: 'course' },
      { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', type: 'article' },
    ],
  },
  'React': {
    beginner: [
      { title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'course' },
      { title: 'React Documentation', url: 'https://react.dev/', type: 'article' },
    ],
    intermediate: [
      { title: 'React Intermediate Course', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', type: 'course' },
      { title: 'React Patterns', url: 'https://reactpatterns.com/', type: 'article' },
    ],
    advanced: [
      { title: 'Advanced React Patterns', url: 'https://kentcdodds.com/blog/advanced-react-patterns', type: 'article' },
      { title: 'React Performance Optimization', url: 'https://react.dev/learn/render-and-commit', type: 'article' },
    ],
  },
  'LeetCode Practice': {
    beginner: [
      { title: 'LeetCode Easy Problems', url: 'https://leetcode.com/problemset/all/?difficulty=EASY', type: 'practice' },
      { title: 'LeetCode Study Plan', url: 'https://leetcode.com/study-plan/', type: 'practice' },
    ],
    intermediate: [
      { title: 'LeetCode Medium Problems', url: 'https://leetcode.com/problemset/all/?difficulty=MEDIUM', type: 'practice' },
      { title: 'Algorithm Patterns', url: 'https://leetcode.com/discuss/general-discussion/491522/', type: 'article' },
    ],
    advanced: [
      { title: 'LeetCode Hard Problems', url: 'https://leetcode.com/problemset/all/?difficulty=HARD', type: 'practice' },
      { title: 'Competitive Programming', url: 'https://codeforces.com/', type: 'practice' },
    ],
  },
};

export function generateLearningPath(skill: string, level: 'beginner' | 'intermediate' | 'advanced'): LearningPath {
  const resources = learningResources[skill]?.[level] || [
    { title: `${skill} Documentation`, url: '#', type: 'article' as const },
  ];

  const steps: LearningPathStep[] = [
    {
      step: 1,
      title: `Introduction to ${skill}`,
      description: `Get familiar with the fundamentals of ${skill}`,
      resources: resources.slice(0, 2),
      estimatedTime: '2-3 weeks',
    },
    {
      step: 2,
      title: `Hands-on Practice`,
      description: `Build projects and practice with ${skill}`,
      resources: resources.slice(2, 4),
      estimatedTime: '3-4 weeks',
    },
    {
      step: 3,
      title: `Advanced Concepts`,
      description: `Master advanced topics and best practices`,
      resources: resources.slice(4, 6),
      estimatedTime: '4-6 weeks',
    },
  ];

  return {
    skill,
    difficulty: level,
    steps,
    totalEstimatedTime: '10-13 weeks',
  };
};

