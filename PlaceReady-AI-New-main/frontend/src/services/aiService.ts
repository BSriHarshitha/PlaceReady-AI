interface ResumeAnalysis {
  skills: string[];
  experience: number;
  education: string[];
  projects: string[];
  certifications: string[];
  strengths: string[];
  weaknesses: string[];
  score: number;
}

interface SkillRecommendation {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  resources: string[];
}

interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
}

interface LearningPath {
  title: string;
  duration: string;
  modules: LearningModule[];
  difficulty: string;
}

interface LearningModule {
  name: string;
  topics: string[];
  estimatedHours: number;
  resources: string[];
}

class AIService {
  private apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  async parseResume(resumeText: string): Promise<ResumeAnalysis> {
    if (!this.apiKey) return this.getMockResumeAnalysis();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: 'Extract skills, experience, education, projects, certifications, strengths, weaknesses, and provide a score (0-100) from this resume. Return JSON format.'
          }, {
            role: 'user',
            content: resumeText
          }],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      return this.getMockResumeAnalysis();
    }
  }

  async generateSkillRecommendations(currentSkills: string[], targetRole: string, resumeAnalysis?: ResumeAnalysis | null): Promise<SkillRecommendation[]> {
    const skillGaps = this.identifySkillGaps(currentSkills, targetRole, resumeAnalysis);
    
    if (!this.apiKey) return this.getMockSkillRecommendations(skillGaps, targetRole);

    try {
      const prompt = `
        Current skills: ${currentSkills.join(', ')}
        Target role: ${targetRole}
        Skill gaps identified: ${skillGaps.join(', ')}
        ${resumeAnalysis ? `Resume weaknesses: ${resumeAnalysis.weaknesses.join(', ')}` : ''}
        
        Generate 5 personalized skill recommendations with high priority for gaps and weaknesses.
        Return JSON array with skill, priority (high/medium/low), reason, and resources.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: prompt
          }],
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      return this.getMockSkillRecommendations(skillGaps, targetRole);
    }
  }

  private identifySkillGaps(currentSkills: string[], targetRole: string, resumeAnalysis?: ResumeAnalysis | null): string[] {
    const roleRequirements: { [key: string]: string[] } = {
      'Frontend Developer': ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML', 'Redux', 'Webpack'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST APIs', 'Docker'],
      'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'Docker', 'AWS'],
      'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'TensorFlow'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Monitoring'],
      'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
      'Machine Learning Engineer': ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes']
    };

    const required = roleRequirements[targetRole] || [];
    const gaps = required.filter(skill => 
      !currentSkills.some(current => 
        current.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(current.toLowerCase())
      )
    );

    // Add weaknesses from resume analysis as gaps
    if (resumeAnalysis?.weaknesses) {
      gaps.push(...resumeAnalysis.weaknesses.filter(weakness => !gaps.includes(weakness)));
    }

    return gaps.slice(0, 5); // Return top 5 gaps
  }

  async generateInterviewQuestions(role: string, skills: string[]): Promise<InterviewQuestion[]> {
    if (!this.apiKey) return this.getMockInterviewQuestions();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: `Generate 10 interview questions for ${role} role focusing on skills: ${skills.join(', ')}. Include technical, behavioral, and situational questions. Return JSON array.`
          }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      return this.getMockInterviewQuestions();
    }
  }

  async createLearningPath(currentSkills: string[], targetRole: string): Promise<LearningPath> {
    if (!this.apiKey) return this.getMockLearningPath();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'system',
            content: `Create a personalized learning path for ${targetRole} role. Current skills: ${currentSkills.join(', ')}. Include modules with topics, hours, and resources. Return JSON.`
          }],
          temperature: 0.4,
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      return this.getMockLearningPath();
    }
  }

  private getMockResumeAnalysis(): ResumeAnalysis {
    return {
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      experience: 2,
      education: ['B.Tech Computer Science'],
      projects: ['E-commerce App', 'Task Manager', 'Weather App'],
      certifications: ['AWS Cloud Practitioner'],
      strengths: ['Problem Solving', 'Team Collaboration', 'Quick Learning'],
      weaknesses: ['System Design', 'Advanced Algorithms'],
      score: 75
    };
  }

  private getMockSkillRecommendations(skillGaps: string[] = [], targetRole: string = ''): SkillRecommendation[] {
    const dynamicRecommendations = skillGaps.map(skill => ({
      skill,
      priority: 'high' as const,
      reason: `Critical skill gap for ${targetRole} role`,
      resources: [`${skill} Documentation`, `${skill} Tutorial`, `${skill} Best Practices`]
    }));

    const defaultRecommendations = [
      {
        skill: 'System Design',
        priority: 'high' as const,
        reason: 'Critical for senior roles and scalable applications',
        resources: ['System Design Primer', 'Designing Data-Intensive Applications']
      },
      {
        skill: 'Docker',
        priority: 'high' as const,
        reason: 'Essential for modern deployment and DevOps',
        resources: ['Docker Documentation', 'Docker Mastery Course']
      },
      {
        skill: 'TypeScript',
        priority: 'medium' as const,
        reason: 'Improves code quality and developer experience',
        resources: ['TypeScript Handbook', 'TypeScript Deep Dive']
      }
    ];

    return dynamicRecommendations.length > 0 ? dynamicRecommendations : defaultRecommendations;
  }

  private getMockInterviewQuestions(): InterviewQuestion[] {
    return [
      {
        question: 'Explain the difference between let, const, and var in JavaScript',
        type: 'technical',
        difficulty: 'easy',
        expectedAnswer: 'var is function-scoped, let and const are block-scoped. const cannot be reassigned.'
      },
      {
        question: 'How do you handle state management in large React applications?',
        type: 'technical',
        difficulty: 'medium',
        expectedAnswer: 'Use Context API, Redux, or Zustand for global state management.'
      },
      {
        question: 'Tell me about a challenging project you worked on',
        type: 'behavioral',
        difficulty: 'medium',
        expectedAnswer: 'Describe project, challenges faced, solutions implemented, and outcomes.'
      }
    ];
  }

  private getMockLearningPath(): LearningPath {
    return {
      title: 'Full Stack Developer Path',
      duration: '6 months',
      difficulty: 'Intermediate',
      modules: [
        {
          name: 'Advanced JavaScript',
          topics: ['Closures', 'Promises', 'Async/Await', 'ES6+ Features'],
          estimatedHours: 40,
          resources: ['MDN JavaScript Guide', 'JavaScript.info']
        },
        {
          name: 'System Design Fundamentals',
          topics: ['Scalability', 'Load Balancing', 'Databases', 'Caching'],
          estimatedHours: 60,
          resources: ['System Design Interview', 'High Scalability Blog']
        },
        {
          name: 'DevOps Basics',
          topics: ['Docker', 'CI/CD', 'AWS Services', 'Monitoring'],
          estimatedHours: 50,
          resources: ['Docker Documentation', 'AWS Free Tier']
        }
      ]
    };
  }
}

export default new AIService();
export type { ResumeAnalysis, SkillRecommendation, InterviewQuestion, LearningPath };