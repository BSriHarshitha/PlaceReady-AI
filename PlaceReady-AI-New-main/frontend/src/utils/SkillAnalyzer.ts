// AI-Powered Skill Analysis Engine
export class SkillAnalyzer {
  private static skillKeywords = {
    programming: [
      'javascript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'typescript',
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'spring', 'hibernate', 'mongodb', 'mysql', 'postgresql', 'redis'
    ],
    dataStructures: [
      'arrays', 'linked lists', 'stacks', 'queues', 'trees', 'graphs',
      'hash tables', 'heaps', 'tries', 'dynamic programming', 'algorithms'
    ],
    systemDesign: [
      'microservices', 'distributed systems', 'load balancing', 'caching',
      'database design', 'scalability', 'api design', 'system architecture'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
      'jenkins', 'ci/cd', 'devops', 'cloud computing'
    ],
    softSkills: [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'project management', 'presentation', 'collaboration'
    ]
  };

  private static experienceWeights = {
    'internship': 0.3,
    'project': 0.2,
    'experience': 0.4,
    'certification': 0.1
  };

  static analyzeResume(resumeText: string): ResumeAnalysis {
    const skills = this.extractSkills(resumeText);
    const experience = this.analyzeExperience(resumeText);
    const projects = this.extractProjects(resumeText);
    
    const score = this.calculateResumeScore(skills, experience, projects);
    
    return {
      skills,
      experience,
      projects,
      score,
      recommendations: this.generateRecommendations(skills, score)
    };
  }

  static analyzeCodingProfile(profiles: CodingProfiles): CodingAnalysis {
    let totalScore = 0;
    let profileCount = 0;

    // Mock analysis - in real implementation, would call APIs
    const analysis: CodingAnalysis = {
      leetcodeScore: 0,
      codechefScore: 0,
      codeforcesScore: 0,
      githubScore: 0,
      overallScore: 0,
      strengths: [],
      weaknesses: []
    };

    if (profiles.leetcode) {
      analysis.leetcodeScore = this.mockLeetCodeAnalysis(profiles.leetcode);
      totalScore += analysis.leetcodeScore;
      profileCount++;
    }

    if (profiles.codechef) {
      analysis.codechefScore = this.mockCodeChefAnalysis(profiles.codechef);
      totalScore += analysis.codechefScore;
      profileCount++;
    }

    if (profiles.codeforces) {
      analysis.codeforcesScore = this.mockCodeforcesAnalysis(profiles.codeforces);
      totalScore += analysis.codeforcesScore;
      profileCount++;
    }

    if (profiles.github) {
      analysis.githubScore = this.mockGitHubAnalysis(profiles.github);
      totalScore += analysis.githubScore;
      profileCount++;
    }

    analysis.overallScore = profileCount > 0 ? totalScore / profileCount : 0;
    analysis.strengths = this.identifyStrengths(analysis);
    analysis.weaknesses = this.identifyWeaknesses(analysis);

    return analysis;
  }

  static analyzeLinkedIn(linkedinText: string): LinkedInAnalysis {
    const skills = this.extractSkills(linkedinText);
    const experience = this.analyzeExperience(linkedinText);
    const leadership = this.detectLeadership(linkedinText);
    
    const score = this.calculateLinkedInScore(skills, experience, leadership);
    
    return {
      skills,
      experience,
      leadership,
      score,
      professionalSummary: this.extractSummary(linkedinText)
    };
  }

  static calculateFinalReadiness(
    resumeAnalysis: ResumeAnalysis,
    codingAnalysis: CodingAnalysis,
    linkedinAnalysis: LinkedInAnalysis
  ): ReadinessReport {
    const resumeWeight = 0.4;
    const codingWeight = 0.4;
    const linkedinWeight = 0.2;

    const finalScore = Math.round(
      (resumeAnalysis.score * resumeWeight) +
      (codingAnalysis.overallScore * codingWeight) +
      (linkedinAnalysis.score * linkedinWeight)
    );

    const allSkills = [
      ...resumeAnalysis.skills,
      ...linkedinAnalysis.skills
    ].filter((skill, index, self) => self.indexOf(skill) === index);

    const skillGaps = this.identifySkillGaps(allSkills, finalScore);
    const recommendations = this.generatePersonalizedRecommendations(
      resumeAnalysis,
      codingAnalysis,
      linkedinAnalysis,
      finalScore
    );

    return {
      finalScore,
      resumeScore: resumeAnalysis.score,
      codingScore: codingAnalysis.overallScore,
      linkedinScore: linkedinAnalysis.score,
      skills: allSkills,
      skillGaps,
      recommendations,
      readinessLevel: this.getReadinessLevel(finalScore)
    };
  }

  private static extractSkills(text: string): string[] {
    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    Object.values(this.skillKeywords).flat().forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return Array.from(new Set(foundSkills));
  }

  private static analyzeExperience(text: string): number {
    const experienceKeywords = ['years', 'months', 'internship', 'experience', 'worked'];
    let experienceScore = 0;

    experienceKeywords.forEach(keyword => {
      const regex = new RegExp(`\\d+\\s*${keyword}`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        experienceScore += matches.length * 10;
      }
    });

    return Math.min(experienceScore, 100);
  }

  private static extractProjects(text: string): string[] {
    const projectKeywords = ['project', 'built', 'developed', 'created', 'implemented'];
    const projects: string[] = [];

    projectKeywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^.]*`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        projects.push(...matches.slice(0, 3)); // Limit to 3 projects
      }
    });

    return projects;
  }

  private static calculateResumeScore(
    skills: string[],
    experience: number,
    projects: string[]
  ): number {
    const skillScore = Math.min(skills.length * 5, 40);
    const experienceScore = Math.min(experience, 30);
    const projectScore = Math.min(projects.length * 10, 30);

    return skillScore + experienceScore + projectScore;
  }

  private static mockLeetCodeAnalysis(username: string): number {
    // Mock analysis - in real implementation, would call LeetCode API
    return Math.floor(Math.random() * 40) + 60; // 60-100
  }

  private static mockCodeChefAnalysis(username: string): number {
    return Math.floor(Math.random() * 30) + 50; // 50-80
  }

  private static mockCodeforcesAnalysis(username: string): number {
    return Math.floor(Math.random() * 35) + 55; // 55-90
  }

  private static mockGitHubAnalysis(username: string): number {
    return Math.floor(Math.random() * 25) + 65; // 65-90
  }

  private static identifyStrengths(analysis: CodingAnalysis): string[] {
    const strengths: string[] = [];
    
    if (analysis.leetcodeScore > 80) strengths.push('Problem Solving');
    if (analysis.githubScore > 75) strengths.push('Project Development');
    if (analysis.codeforcesScore > 70) strengths.push('Competitive Programming');
    
    return strengths;
  }

  private static identifyWeaknesses(analysis: CodingAnalysis): string[] {
    const weaknesses: string[] = [];
    
    if (analysis.leetcodeScore < 60) weaknesses.push('Algorithm Practice');
    if (analysis.githubScore < 50) weaknesses.push('Open Source Contribution');
    if (analysis.codechefScore < 50) weaknesses.push('Contest Participation');
    
    return weaknesses;
  }

  private static detectLeadership(text: string): boolean {
    const leadershipKeywords = ['led', 'managed', 'coordinated', 'organized', 'mentored'];
    return leadershipKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  private static calculateLinkedInScore(
    skills: string[],
    experience: number,
    leadership: boolean
  ): number {
    const skillScore = Math.min(skills.length * 4, 40);
    const experienceScore = Math.min(experience, 40);
    const leadershipScore = leadership ? 20 : 0;

    return skillScore + experienceScore + leadershipScore;
  }

  private static extractSummary(text: string): string {
    const sentences = text.split('.').slice(0, 3);
    return sentences.join('.') + '.';
  }

  private static identifySkillGaps(skills: string[], score: number): string[] {
    const requiredSkills = [
      'System Design', 'Data Structures', 'Algorithms',
      'Database Design', 'API Development', 'Testing'
    ];

    return requiredSkills.filter(skill => 
      !skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  private static generateRecommendations(skills: string[], score: number): string[] {
    const recommendations: string[] = [];

    if (score < 60) {
      recommendations.push('Focus on building more projects');
      recommendations.push('Improve technical skills documentation');
    }

    if (skills.length < 8) {
      recommendations.push('Learn trending technologies');
    }

    return recommendations;
  }

  private static generatePersonalizedRecommendations(
    resume: ResumeAnalysis,
    coding: CodingAnalysis,
    linkedin: LinkedInAnalysis,
    finalScore: number
  ): string[] {
    const recommendations: string[] = [];

    // Resume-based recommendations
    if (resume.score < 60) {
      recommendations.push('Enhance resume with quantified achievements and metrics');
      recommendations.push('Add impact statements to your experience sections');
    } else if (resume.score < 75) {
      recommendations.push('Improve impact descriptions with concrete numbers and percentages');
    }

    // Skills-based recommendations
    if (resume.skills.length < 5) {
      recommendations.push('Expand your technical skill set - aim for at least 8-10 key skills');
    }

    if (!resume.skills.some(s => s.toLowerCase().includes('system'))) {
      recommendations.push('Learn System Design - critical for senior roles');
    }

    if (!resume.skills.some(s => s.toLowerCase().includes('docker') || s.toLowerCase().includes('kubernetes'))) {
      recommendations.push('Learn containerization (Docker/Kubernetes) for modern DevOps practices');
    }

    if (!resume.skills.some(s => s.toLowerCase().includes('aws') || s.toLowerCase().includes('gcp') || s.toLowerCase().includes('azure'))) {
      recommendations.push('Get cloud platform certification (AWS, GCP, or Azure)');
    }

    // Experience-based recommendations
    if (resume.experience < 30) {
      recommendations.push('Seek more internship/work experience - focus on real-world projects');
    } else if (resume.experience < 60) {
      recommendations.push('Document and highlight your practical project outcomes');
    }

    // Project-based recommendations
    if (resume.projects.length < 2) {
      recommendations.push('Build and showcase 2-3 production-ready projects on GitHub');
      recommendations.push('Create projects that solve real problems to impress recruiters');
    }

    // Coding profile recommendations
    if (coding.overallScore < 50) {
      recommendations.push('Start with consistent LeetCode practice (3-5 problems daily)');
      recommendations.push('Master fundamental data structures and algorithms');
    } else if (coding.overallScore < 70) {
      recommendations.push('Solve medium-level coding problems regularly');
      recommendations.push('Participate in competitive programming contests');
    }

    if (coding.leetcodeScore < 60) {
      recommendations.push('Increase LeetCode problem-solving practice for interview prep');
    }

    if (coding.githubScore < 60) {
      recommendations.push('Contribute to open-source projects and maintain active GitHub presence');
    }

    if (coding.codeforcesScore < 60) {
      recommendations.push('Participate in competitive programming contests (Codeforces, CodeChef)');
    }

    // LinkedIn recommendations
    if (linkedin.score < 60) {
      recommendations.push('Create a comprehensive LinkedIn profile with detailed experience descriptions');
    }

    if (!linkedin.leadership) {
      recommendations.push('Highlight leadership experience or take on team lead responsibilities');
    }

    // Overall readiness recommendations
    if (finalScore < 50) {
      recommendations.push('Focus on fundamentals - start with core DSA and web development concepts');
      recommendations.push('Follow a structured learning path (3-6 months intensive prep)');
    } else if (finalScore < 65) {
      recommendations.push('Bridge skill gaps systematically - prioritize System Design and DevOps');
      recommendations.push('Build projects that demonstrate your strongest skills');
    } else if (finalScore < 80) {
      recommendations.push('Prepare for advanced system design interviews');
      recommendations.push('Polish your resume and LinkedIn for senior positions');
    }

    // Remove duplicates
    return Array.from(new Set(recommendations));
  }

  private static getReadinessLevel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  }
}

// Type definitions
export interface ResumeAnalysis {
  skills: string[];
  experience: number;
  projects: string[];
  score: number;
  recommendations: string[];
}

export interface CodingProfiles {
  leetcode?: string;
  codechef?: string;
  codeforces?: string;
  github?: string;
}

export interface CodingAnalysis {
  leetcodeScore: number;
  codechefScore: number;
  codeforcesScore: number;
  githubScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface LinkedInAnalysis {
  skills: string[];
  experience: number;
  leadership: boolean;
  score: number;
  professionalSummary: string;
}

export interface ReadinessReport {
  finalScore: number;
  resumeScore: number;
  codingScore: number;
  linkedinScore: number;
  skills: string[];
  skillGaps: string[];
  recommendations: string[];
  readinessLevel: string;
}